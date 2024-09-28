using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Diagnostics;

public class ShureDiscoveryService : IDisposable
{
    private const string MulticastAddress = "239.255.254.253";
    private const int MulticastPort = 8427;
    private UdpClient udpClient;
    private bool isListening;
    public event EventHandler<string> DeviceDiscovered;

    public ShureDiscoveryService()
    {
        udpClient = new UdpClient();
    }

    public async Task StartListeningAsync()
    {
        if (isListening) return;
        isListening = true;
        udpClient.JoinMulticastGroup(IPAddress.Parse(MulticastAddress));
        udpClient.Client.Bind(new IPEndPoint(IPAddress.Any, MulticastPort));
        Debug.Print("Listening for Shure devices...");
        while (isListening)
        {
            try
            {
                // Receive data from the multicast group
                var result = await udpClient.ReceiveAsync();
                string deviceInfo = Encoding.UTF8.GetString(result.Buffer);
                // Fire the event to notify listeners
                DeviceDiscovered?.Invoke(this, deviceInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error receiving data: {ex.Message}");
            }
        }
    }

    public void StopListening()
    {
        isListening = false;
        udpClient?.DropMulticastGroup(IPAddress.Parse(MulticastAddress));
        udpClient?.Close();
    }

    public void Dispose()
    {
        StopListening();
        udpClient?.Dispose();
    }
}
