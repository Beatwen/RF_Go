using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Models.Licensing
{
    public class User
    {
        public string userName { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public int id { get; set; }
        public string email { get; set; }
        public string createdAt { get; set; }
        public string updatedAt { get; set; }
    }
}
