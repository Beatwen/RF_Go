using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Services.NetworkProtocols
{
    public class UDPCommunicationService
    {
        private readonly UdpClient _udpClient;

        public UDPCommunicationService()
        {
            _udpClient = new UdpClient();
        }

        public async Task<string> SendCommandAsync(string ip, int port, string command)
        {
            try
            {
                var data = Encoding.UTF8.GetBytes(command);
                Debug.WriteLine("Commande envoyé : " + command);
                await _udpClient.SendAsync(data, data.Length, ip, port);
                var result = await _udpClient.ReceiveAsync();
                return Encoding.UTF8.GetString(result.Buffer);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to communicate with device at {ip}:{port} - {ex.Message}");
                return null;
            }
        }
    }
}
