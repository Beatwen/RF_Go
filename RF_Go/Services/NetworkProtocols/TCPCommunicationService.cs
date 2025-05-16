using System;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace RF_Go.Services.NetworkProtocols
{
    public class TCPCommunicationService : IDisposable
    {
        private readonly ConcurrentDictionary<string, TcpClient> _tcpClients;
        private readonly ConcurrentDictionary<string, TaskCompletionSource<string>> _responseTasks;
        private const int DEFAULT_TIMEOUT = 5000; // 5 seconds timeout

        public TCPCommunicationService()
        {
            _tcpClients = new ConcurrentDictionary<string, TcpClient>();
            _responseTasks = new ConcurrentDictionary<string, TaskCompletionSource<string>>();
        }

        public async Task<string> SendCommandAsync(string ip, int port, string command)
        {
            try
            {
                var tcpClient = await GetOrCreateTcpClientAsync(ip, port);
                if (tcpClient == null)
                {
                    Debug.WriteLine($"Failed to create TCP connection to {ip}:{port}");
                    return null;
                }

                var tcs = new TaskCompletionSource<string>();
                string key = $"{ip}:{port}";
                _responseTasks[key] = tcs;

                // Send the command
                var data = Encoding.UTF8.GetBytes(command);
                await tcpClient.GetStream().WriteAsync(data, 0, data.Length);
                Debug.WriteLine($"Command sent to {ip}:{port}: {command}");

                // Wait for response with timeout
                var timeoutTask = Task.Delay(DEFAULT_TIMEOUT);
                var completedTask = await Task.WhenAny(tcs.Task, timeoutTask);

                if (completedTask == timeoutTask)
                {
                    _responseTasks.TryRemove(key, out _);
                    Debug.WriteLine($"No response received from {ip}:{port} after {DEFAULT_TIMEOUT}ms");
                    return null;
                }

                var response = await tcs.Task;
                Debug.WriteLine($"Response received from {ip}:{port}: {response}");
                return response;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error communicating with device at {ip}:{port}: {ex.Message}");
                return null;
            }
        }

        private async Task<TcpClient> GetOrCreateTcpClientAsync(string ip, int port)
        {
            string key = $"{ip}:{port}";
            
            if (_tcpClients.TryGetValue(key, out var existingClient))
            {
                if (existingClient.Connected)
                {
                    return existingClient;
                }
                else
                {
                    // Client exists but is disconnected, remove it
                    _tcpClients.TryRemove(key, out _);
                    existingClient.Dispose();
                }
            }

            try
            {
                var newClient = new TcpClient();
                await newClient.ConnectAsync(ip, port);
                
                if (_tcpClients.TryAdd(key, newClient))
                {
                    // Start listening for responses
                    _ = ListenForResponsesAsync(newClient, key);
                    return newClient;
                }
                else
                {
                    newClient.Dispose();
                    return null;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to create TCP connection to {ip}:{port}: {ex.Message}");
                return null;
            }
        }

        private async Task ListenForResponsesAsync(TcpClient client, string key)
        {
            try
            {
                var stream = client.GetStream();
                var buffer = new byte[4096];

                while (client.Connected)
                {
                    int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
                    if (bytesRead == 0) break; // Connection closed

                    var response = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    
                    if (_responseTasks.TryRemove(key, out var tcs))
                    {
                        tcs.SetResult(response);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in TCP response listener for {key}: {ex.Message}");
            }
            finally
            {
                // Clean up the client if it's disconnected
                if (_tcpClients.TryRemove(key, out var removedClient))
                {
                    removedClient.Dispose();
                }
            }
        }

        public void Dispose()
        {
            foreach (var client in _tcpClients.Values)
            {
                try
                {
                    client.Close();
                    client.Dispose();
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error disposing TCP client: {ex.Message}");
                }
            }
            _tcpClients.Clear();
        }
    }
} 