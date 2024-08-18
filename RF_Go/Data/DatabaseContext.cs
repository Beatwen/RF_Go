using SQLite;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq.Expressions;
using System.Threading.Tasks;
using RF_Go.Models;
using System.Diagnostics;

namespace RF_Go.Data
{
    public class DatabaseContext : IAsyncDisposable
    {
        private const string DbName = "Session22.db3";
        private static string DbPath => Path.Combine(FileSystem.AppDataDirectory, DbName);

        private SQLiteAsyncConnection _connection;
        private SQLiteAsyncConnection Database =>
            _connection ??= new SQLiteAsyncConnection(DbPath,
                SQLiteOpenFlags.Create | SQLiteOpenFlags.ReadWrite | SQLiteOpenFlags.SharedCache);

        public DatabaseContext()
        {
            // Appeler CreateTablesAsync lors de l'initialisation du contexte
            Task.Run(async () => await CreateTablesAsync()).Wait();
        }

        private async Task CreateTableIfNotExists<TTable>() where TTable : class, new()
        {
            Console.WriteLine($"Creating table for {typeof(TTable).Name}");
            await Database.CreateTableAsync<TTable>();
        }

        private async Task CreateTablesAsync()
        {
            await CreateTableIfNotExists<RFGroup>();
            await CreateTableIfNotExists<RFDevice>();

            // Insérer les groupes initiaux
            await InsertInitialGroups();
        }

        private async Task InsertInitialGroups()
        {

            var existingGroups = await Database.Table<RFGroup>().CountAsync();
            if (existingGroups == 0)
            {
                var initialGroups = new RFGroup();
                initialGroups.Name = "Default Group";
                await Database.InsertAsync(initialGroups);
            }
        }

        private AsyncTableQuery<TTable> GetTable<TTable>() where TTable : class, new()
        {
            return Database.Table<TTable>();
        }

        public async Task<IEnumerable<TTable>> GetAllAsync<TTable>() where TTable : class, new()
        {

/* Modification non fusionnée à partir du projet 'RF_Go (net8.0-windows10.0.19041.0)'
Avant :
            var table = await GetTableAsync<TTable>();
Après :
            var table = GetTable<TTable>();
*/
            var table = GetTable<TTable>();
            return await table.ToListAsync();
        }
        public async Task<IEnumerable<TTable>> GetFilteredAsync<TTable>(Expression<Func<TTable, bool>> predicate) where TTable : class, new()
        {

/* Modification non fusionnée à partir du projet 'RF_Go (net8.0-windows10.0.19041.0)'
Avant :
            var table = await GetTableAsync<TTable>();
Après :
            var table = GetTable<TTable>();
*/
            var table = GetTable<TTable>();
            return await table.Where(predicate).ToListAsync();
        }

        private async Task<TResult> Execute<TTable, TResult>(Func<Task<TResult>> action) where TTable : class, new()
        {
            return await action();
        }

        public async Task<TTable> GetItemByKeyAsync<TTable>(object primaryKey) where TTable : class, new()
        {
            return await Execute<TTable, TTable>(async () => await Database.GetAsync<TTable>(primaryKey));
        }

        public async Task<bool> AddItemAsync<TTable>(TTable item) where TTable : class, new()
        {
            return await Execute<TTable, bool>(async () => await Database.InsertAsync(item) > 0);
        }
        public async Task<bool> UpdateItemAsync<TTable>(TTable item) where TTable : class, new()
        {
            try
            {
                var result = await Execute<TTable, bool>(async () =>
                {
                    var updateResult = await Database.UpdateAsync(item);
                    Debug.WriteLine($"Attempting to update: {typeof(TTable).Name}, Rows affected: {updateResult}");
                    return updateResult > 0;
                });
                return result;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in UpdateItemAsync for {typeof(TTable).Name}: {ex.Message}");
                throw;  // Re-throwing to ensure the error is not swallowed silently
            }
        }


        public async Task<bool> DeleteItemAsync<TTable>(TTable item) where TTable : class, new()
        {
            return await Execute<TTable, bool>(async () => await Database.DeleteAsync(item) > 0);
        }

        public async Task<bool> DeleteItemByKeyAsync<TTable>(object primaryKey) where TTable : class, new()
        {
            return await Execute<TTable, bool>(async () => await Database.DeleteAsync<TTable>(primaryKey) > 0);
        }
        public async Task<RFGroup> GetGroupById(int groupId)
        {
            return await Database.Table<RFGroup>().FirstOrDefaultAsync(g => g.ID == groupId);
        }
        public async ValueTask DisposeAsync()
        {
            if (_connection != null)
            {
                await _connection.CloseAsync();
            }
        }
    }
}
