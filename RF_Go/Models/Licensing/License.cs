
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Models.Licensing
{
    public class License
    {
        public int id;
        public int userId;
        public string type;
        public string status;
        public string password;
        public string emailConfirmed;
        public string createdAt;
        public string updatedAt;
    }
}
