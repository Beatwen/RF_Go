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
        private readonly UdpClient _udpClient;
        private readonly ConcurrentDictionary<string, TaskCompletionSource<string>> _responseTasks;

        public UDPCommunicationService()
        {
            _udpClient = new UdpClient();
            _udpClient.Client.Bind(new IPEndPoint(IPAddress.Any, 0)); // Lier à une adresse locale
            _responseTasks = new ConcurrentDictionary<string, TaskCompletionSource<string>>();
            _ = ListenForResponsesAsync();
        }

        public async Task<string> SendCommandAsync(string ip, int port, string command)
        {
            try
            {
                var data = Encoding.UTF8.GetBytes(command);
                Debug.WriteLine($"Commande envoyée à {ip}:{port} : {command}");

                var tcs = new TaskCompletionSource<string>();
                _responseTasks[ip] = tcs;

                await _udpClient.SendAsync(data, data.Length, ip, port);

                var timeoutTask = Task.Delay(5000); // Timeout de 5 secondes
                var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);

                if (completedTask == timeoutTask)
                {
                    _responseTasks.TryRemove(ip, out _);
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

        private async Task ListenForResponsesAsync()
        {
            while (true)
            {
                try
                {
                    var result = await _udpClient.ReceiveAsync();
                    var response = Encoding.UTF8.GetString(result.Buffer);
                    var ip = result.RemoteEndPoint.Address.ToString();

                    if (_responseTasks.TryRemove(ip, out var tcs))
                    {
                        tcs.SetResult(response);
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error receiving UDP response: {ex.Message}");
                }
            }
        }
    }
}
