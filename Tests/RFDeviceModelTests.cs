using RF_Go.Models;

namespace Tests
{
    public class RFDeviceModelTests
    {
        [Fact]
        public void RFDevice_Constructor_InitializesDefaultValues()
        {
            // Arrange & Act
            var device = new RFDevice();

            // Assert
            Assert.Equal(0, device.ID);
            Assert.Null(device.SerialNumber);
            Assert.False(device.Selected);
            Assert.Null(device.Brand);
            Assert.Null(device.Model);
            Assert.Null(device.Name);
            Assert.Null(device.Frequency);
            Assert.NotNull(device.Channels);
            Assert.Empty(device.Channels);
            Assert.Equal("0.0.0.0", device.IpAddress);
            Assert.Equal(1, device.GroupID);
            Assert.False(device.IsSynced);
            Assert.False(device.IsOnline);
            Assert.False(device.PendingSync);
        }

        [Fact]
        public void RFDevice_SetBrand_UpdatesProperty()
        {
            // Arrange
            var device = new RFDevice();
            var expectedBrand = "TestBrand";

            // Act
            device.Brand = expectedBrand;

            // Assert
            Assert.Equal(expectedBrand, device.Brand);
        }

        [Fact]
        public void RFDevice_SetModel_UpdatesProperty()
        {
            // Arrange
            var device = new RFDevice();
            var expectedModel = "TestModel";

            // Act
            device.Model = expectedModel;

            // Assert
            Assert.Equal(expectedModel, device.Model);
        }

        [Theory]
        [InlineData("192.168.1.1")]
        [InlineData("10.0.0.1")]
        [InlineData("255.255.255.255")]
        public void RFDevice_SetIpAddress_ValidatesCorrectly(string ipAddress)
        {
            // Arrange
            var device = new RFDevice();

            // Act
            device.IpAddress = ipAddress;

            // Assert
            Assert.Equal(ipAddress, device.IpAddress);
        }

        [Fact]
        public void RFDevice_AddChannel_IncreasesChannelCount()
        {
            // Arrange
            var device = new RFDevice();
            var channel = new RFChannel { Frequency = 100 };

            // Act
            device.Channels.Add(channel);

            // Assert
            Assert.Single(device.Channels);
            Assert.Contains(channel, device.Channels);
        }

        [Fact]
        public void RFDevice_Validate_WithNullBrand_ReturnsInvalid()
        {
            // Arrange
            var device = new RFDevice { Brand = null };

            // Act
            var (isValid, errorMessage) = device.Validate();

            // Assert
            Assert.False(isValid);
            Assert.True(errorMessage.Contains("brand is required"));
        }

        [Fact]
        public void RFDevice_Validate_WithValidBrand_ReturnsValid()
        {
            // Arrange
            var device = new RFDevice { Brand = "Shure" };

            // Act
            var (isValid, errorMessage) = device.Validate();

            // Assert
            Assert.True(isValid);
            Assert.Equal(string.Empty, errorMessage);
        }

        [Fact]
        public void RFDevice_GroupID_CanBeSet()
        {
            // Arrange
            var device = new RFDevice();

            // Act
            device.GroupID = 10;

            // Assert
            Assert.Equal(10, device.GroupID);
        }
    }
} 