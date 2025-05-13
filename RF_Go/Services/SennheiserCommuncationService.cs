using System;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Services
{
    public class SennheiserCommunicationService
    {
        private UdpClient _udpClient224;
        private UdpClient _udpClient251;
        private readonly IPAddress _multicastAddress224 = IPAddress.Parse("224.0.0.224");
        private readonly IPAddress _multicastAddress251 = IPAddress.Parse("224.0.0.251");
        private readonly IPEndPoint _multicastEndPoint224;
        private readonly IPEndPoint _multicastEndPoint251;
        private readonly int _multicastPort = 8133;
        private readonly IPEndPoint _localEndPoint224;
        private readonly IPEndPoint _localEndPoint251;

        // Your IP address (replace with your actual IP)
        private readonly IPAddress _localIPAddress = IPAddress.Parse("192.168.0.31");

        public SennheiserCommunicationService()
        {
            // Local endpoints for each client
            _localEndPoint224 = new IPEndPoint(IPAddress.Any, 0);  // Use 0 to let the OS choose the port
            _localEndPoint251 = new IPEndPoint(IPAddress.Any, 0);  // Use 0 to let the OS choose the port

            _multicastEndPoint224 = new IPEndPoint(_multicastAddress224, 8101);  // Send to 224.0.0.224
            _multicastEndPoint251 = new IPEndPoint(_multicastAddress251, _multicastPort);  // Send to 224.0.0.251

            // Create separate UDP clients for each multicast address
            _udpClient224 = new UdpClient();
            _udpClient251 = new UdpClient();
        }

        public async Task StartCommunicationAsync()
        {
            try
            {
                // Setup for 224.0.0.224 multicast
                _udpClient224.Client.Bind(_localEndPoint224);
                _udpClient224.JoinMulticastGroup(_multicastAddress224);
                _udpClient224.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.MulticastTimeToLive, 255); // Set TTL to 255
                Debug.WriteLine("Joined multicast group 224.0.0.224");

                // Setup for 224.0.0.251 multicast
                _udpClient251.Client.Bind(_localEndPoint251);
                _udpClient251.JoinMulticastGroup(_multicastAddress251);
                _udpClient251.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.MulticastTimeToLive, 255); // Set TTL to 255
                Debug.WriteLine("Joined multicast group 224.0.0.251");

                // Send the IP address announcement packet
                await SendIPAddressAnnouncementAsync();

                // Send the discovery packet
                await SendDiscoveryPacketAsync();

                // Listen for responses
                await ListenForResponsesAsync();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during communication: {ex.Message}");
            }
        }

        private async Task SendIPAddressAnnouncementAsync()
        {
            try
            {
                // Construct the IP announcement packet
                byte[] ipAnnouncementPacket = new byte[1035];
                byte[] ipAddressAnnouncement = Encoding.ASCII.GetBytes(_localIPAddress.ToString());
                byte[] header = new byte[]
                {
                    0x01, 0x00, 0x5e, 0x00, 0x00, 0xe0, 0x84, 0xfd, // multicast MAC address
                    0xd1, 0x5b, 0xbe, 0xb8, 0x08, 0x00, 0x45, 0x00, // Ethernet + IP header
                    0x00, 0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x11, // UDP header
                    0x00, 0x00, 0xc0, 0xa8, 0x00, 0x1f, 0xe0, 0x00, // Source IP, multicast IP
                    0x00, 0xe0, 0x1f, 0xa5, 0x1f, 0xa5, 0x00, 0x14, 0xa1, 0xcd, // More of the packet
                };

                // Fill the packet
                Buffer.BlockCopy(header, 0, ipAnnouncementPacket, 0, header.Length);
                Buffer.BlockCopy(ipAddressAnnouncement, 0, ipAnnouncementPacket, header.Length, ipAddressAnnouncement.Length);

                // Send the packet to 224.0.0.224
                Debug.WriteLine("224!");
                await _udpClient224.SendAsync(ipAnnouncementPacket, ipAnnouncementPacket.Length, _multicastEndPoint224);
                Debug.WriteLine("Sent IP address announcement packet to 224.0.0.224 multicast group.");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error sending to 224.0.0.224: {ex.Message}");
            }
        }

        private async Task SendDiscoveryPacketAsync()
        {
            try
            {
                // Construct the discovery packet
                byte[] commandPacket = new byte[1035];
                byte[] header = new byte[]
                {
                    0x12, 0x07, 0x06, 0x20, 0x00, 0x00, 0x19, 0x00 // WSM header
                };

                // Command bytes
                byte[] command = Encoding.ASCII.GetBytes("[servicecommand]devinfo\r\n");

                // Insert header and command into the packet
                Buffer.BlockCopy(header, 0, commandPacket, 0, header.Length);
                Buffer.BlockCopy(command, 0, commandPacket, header.Length, command.Length);

                // Send the packet to 224.0.0.251
                Debug.WriteLine("251!");
                await _udpClient251.SendAsync(commandPacket, commandPacket.Length, _multicastEndPoint251);
                Debug.WriteLine("Sent discovery packet to 224.0.0.251 multicast group.");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error sending to 224.0.0.251: {ex.Message}");
            }
        }

        private async Task ListenForResponsesAsync()
        {
            while (true)
            {
                var task224 = _udpClient224.ReceiveAsync();
                var task251 = _udpClient251.ReceiveAsync();
                var completedTask = await Task.WhenAny(task224, task251);
                UdpReceiveResult result = await completedTask;

                // Log raw byte data
                string hexData = BitConverter.ToString(result.Buffer);
                Debug.WriteLine($"Received raw data: {hexData} from {result.RemoteEndPoint}");

                // Optionally attempt ASCII decoding after logging raw data
                string response = Encoding.ASCII.GetString(result.Buffer);
                Debug.WriteLine($"Received (ASCII): {response} from {result.RemoteEndPoint}");

                // Parse and display device information
                ParseDeviceResponse(result.Buffer);
            }
        }

        private void ParseDeviceResponse(byte[] response)
        {
            string responseString = Encoding.ASCII.GetString(response);
            if (responseString.Contains("Model"))
            {
                Debug.WriteLine("Device Info: " + responseString);
            }
        }

        public void StopCommunication()
        {
            _udpClient224.DropMulticastGroup(_multicastAddress224);
            _udpClient224.Close();

            _udpClient251.DropMulticastGroup(_multicastAddress251);
            _udpClient251.Close();
        }
    }
}
