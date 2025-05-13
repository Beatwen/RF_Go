using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Net;

namespace RF_Go.Services.NetworkProtocols
{
    public class UDPCommunicationService
    {
        private readonly UdpClient _standardUdpClient;
        private readonly ConcurrentDictionary<string, TaskCompletionSource<string>> _responseTasks;
        
        // Client spécifique pour les appareils G4
        private UdpClient _g4UdpClient;
        private const int G4_PORT = 53212;

        public UDPCommunicationService()
        {
            // Client standard pour la plupart des communications UDP
            _standardUdpClient = new UdpClient();
            _standardUdpClient.Client.Bind(new IPEndPoint(IPAddress.Any, 0)); // Lier à une adresse locale dynamique
            
            // Les G4 ont leur propre client sur le port 53212
            // Ce client sera créé à la demande pour éviter les conflits de port
            
            _responseTasks = new ConcurrentDictionary<string, TaskCompletionSource<string>>();
            _ = ListenForResponsesAsync();
        }
        
        private UdpClient GetG4Client()
        {
            // Crée le client G4 seulement s'il est nécessaire
            if (_g4UdpClient == null)
            {
                try
                {
                    _g4UdpClient = new UdpClient();
                    _g4UdpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                    
                    // Essayer de se lier au port G4, mais continuer même en cas d'échec
                    try
                    {
                        _g4UdpClient.Client.Bind(new IPEndPoint(IPAddress.Any, G4_PORT));
                        Debug.WriteLine($"G4 client successfully bound to port {G4_PORT}");
                    }
                    catch
                    {
                        _g4UdpClient.Client.Bind(new IPEndPoint(IPAddress.Any, 0));
                        Debug.WriteLine($"G4 client could not bind to port {G4_PORT}, using dynamic port instead");
                    }
                    
                    // Démarrer la réception
                    _ = ListenForG4ResponsesAsync();
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Failed to create G4 UDP client: {ex.Message}");
                    return null;
                }
            }
            return _g4UdpClient;
        }

        // Méthode standard pour les communications non-G4
        public async Task<string> SendCommandAsync(string ip, int port, string command)
        {
            try
            {
                var data = Encoding.UTF8.GetBytes(command);
                Debug.WriteLine($"Commande envoyée à {ip}:{port} : {command}");

                var tcs = new TaskCompletionSource<string>();
                string key = $"{ip}:{port}";
                _responseTasks[key] = tcs;

                await _standardUdpClient.SendAsync(data, data.Length, ip, port);

                var timeoutTask = Task.Delay(5000); // Timeout de 5 secondes
                var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);

                if (completedTask == timeoutTask)
                {
                    _responseTasks.TryRemove(key, out _);
                    Debug.WriteLine($"Aucune réponse reçue de {ip}:{port} après 5 secondes.");
                    return null;
                }

                var response = await tcs.Task;
                Debug.WriteLine($"Réponse reçue de {ip}:{port} : {response}");
                return response;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to communicate with device at {ip}:{port} - {ex.Message}");
                return null;
            }
        }
        
        // Méthode spécifique pour les appareils G4
        public async Task<string> SendG4CommandAsync(string ip, string command)
        {
            try
            {
                var g4Client = GetG4Client();
                if (g4Client == null)
                {
                    Debug.WriteLine("G4 client not available");
                    return null;
                }
                
                var data = Encoding.UTF8.GetBytes(command);
                Debug.WriteLine($"G4 Command sent to {ip}:{G4_PORT}: {command}");

                var tcs = new TaskCompletionSource<string>();
                string key = $"{ip}:G4";  // Clé spéciale pour les commandes G4
                _responseTasks[key] = tcs;

                await g4Client.SendAsync(data, data.Length, ip, G4_PORT);

                var timeoutTask = Task.Delay(5000);
                var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);

                if (completedTask == timeoutTask)
                {
                    _responseTasks.TryRemove(key, out _);
                    Debug.WriteLine($"No response received from G4 device at {ip} after 5 seconds.");
                    return null;
                }

                var response = await tcs.Task;
                Debug.WriteLine($"Response received from G4 device at {ip}: {response}");
                return response;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to communicate with G4 device at {ip} - {ex.Message}");
                return null;
            }
        }

        private async Task ListenForResponsesAsync()
        {
            while (true)
            {
                try
                {
                    var result = await _standardUdpClient.ReceiveAsync();
                    var response = Encoding.UTF8.GetString(result.Buffer);
                    var ip = result.RemoteEndPoint.Address.ToString();
                    var port = result.RemoteEndPoint.Port;
                    string key = $"{ip}:{port}";

                    // Essayer d'abord avec la clé exacte (IP:port)
                    if (_responseTasks.TryRemove(key, out var tcs))
                    {
                        tcs.SetResult(response);
                        Debug.WriteLine($"Response matched to {key}");
                    }
                    else
                    {
                        // Essayer avec juste l'IP (pour les communications standard)
                        key = $"{ip}:45";  // Port Sennheiser standard
                        if (_responseTasks.TryRemove(key, out tcs))
                        {
                            tcs.SetResult(response);
                            Debug.WriteLine($"Response matched to standard device at {ip}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error receiving UDP response: {ex.Message}");
                }
            }
        }
        
        private async Task ListenForG4ResponsesAsync()
        {
            if (_g4UdpClient == null) return;
            
            while (true)
            {
                try
                {
                    var result = await _g4UdpClient.ReceiveAsync();
                    var response = Encoding.UTF8.GetString(result.Buffer);
                    var ip = result.RemoteEndPoint.Address.ToString();
                    
                    // Utiliser la clé spéciale pour les G4
                    string key = $"{ip}:G4";
                    
                    if (_responseTasks.TryRemove(key, out var tcs))
                    {
                        tcs.SetResult(response);
                        Debug.WriteLine($"G4 response matched to {ip}");
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error receiving G4 UDP response: {ex.Message}");
                    break;  // Sortir de la boucle en cas d'erreur pour éviter les blocages
                }
            }
        }
        
        // Méthode pour nettoyer et libérer les ressources
        public void Dispose()
        {
            try
            {
                _standardUdpClient?.Close();
                _standardUdpClient?.Dispose();
                
                _g4UdpClient?.Close();
                _g4UdpClient?.Dispose();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error disposing UDP clients: {ex.Message}");
            }
        }
    }
}
