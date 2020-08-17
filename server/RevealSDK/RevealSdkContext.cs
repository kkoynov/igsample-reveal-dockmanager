using Infragistics.Sdk;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Server.RevealSDK
{
	public class RevealSdkContext : IRevealSdkContext
    {
        private string _webRootPath;

        public RevealSdkContext(string webRootPath)
        {
            _webRootPath = webRootPath;
        }

        public IRVDataSourceProvider DataSourceProvider => new LocalSampleDataSourceProvider();

        public IRVDataProvider DataProvider => null;

        public IRVAuthenticationProvider AuthenticationProvider => null;

		public async Task<Stream> GetDashboardAsync(string dashboardId)
		{
            return await Task.Run(() =>
            {
                var fileName = Path.Combine(_webRootPath, "App_Data", "DashboardFile", dashboardId);
                return new FileStream(fileName, FileMode.Open, FileAccess.Read);
            });

        }

		public async Task SaveDashboardAsync(string userId, string dashboardId, Stream dashboardStream)
        {
            await Task.Run(() => {
								// "~" is added to the saved .rdash file. (Please overwrite manually)
                var fileName = Path.Combine(_webRootPath, "App_Data", "DashboardFile", "~"+dashboardId);
                using (var fileStream = new FileStream(fileName, FileMode.Create, FileAccess.Write))
                {
                    dashboardStream.CopyTo(fileStream);
                }
            });
        }
	}
    
    internal class LocalSampleDataSourceProvider : IRVDataSourceProvider
    {
        public Task<RVDataSourceItem> ChangeDashboardFilterDataSourceItemAsync(string userId, string dashboardId, RVDashboardFilter globalFilter, RVDataSourceItem dataSourceItem)
        {
            return Task.FromResult<RVDataSourceItem>(null);
        }

        public Task<RVDataSourceItem> ChangeVisualizationDataSourceItemAsync(string userId, string dashboardId, RVVisualization visualization, RVDataSourceItem dataSourceItem)
        {
            if (IsLocalSampleDataResource(dataSourceItem, "Incomes.json") || IsOneDriveSampleDataResource(dataSourceItem, "Incomes.json"))
            {
                return Task.FromResult(CreateLocalSampleDataSourceItem((RVJsonDataSourceItem)dataSourceItem, "Incomes.json"));
            }
            else if (IsLocalSampleDataResource(dataSourceItem, "Stores.json") || IsOneDriveSampleDataResource(dataSourceItem, "Stores.json"))
            {
                return Task.FromResult(CreateLocalSampleDataSourceItem((RVJsonDataSourceItem)dataSourceItem, "Stores.json"));
            }
            else
            {
                return Task.FromResult<RVDataSourceItem>(null);
            }
        }

        private static bool IsOneDriveSampleDataResource(RVDataSourceItem dataSourceItem, string name)
        {
            var jsonItem = dataSourceItem as RVJsonDataSourceItem;
            var odrItem = jsonItem?.ResourceItem as RVOneDriveDataSourceItem;
            return odrItem != null && odrItem.Title.EndsWith(name);
        }

        private static bool IsLocalSampleDataResource(RVDataSourceItem dataSourceItem, string name)
        {
            var jsonItem = dataSourceItem as RVJsonDataSourceItem;
            var localItem = jsonItem?.ResourceItem as RVLocalFileDataSourceItem;
            return localItem != null && localItem.Uri.EndsWith(name);
        }

        private static RVDataSourceItem CreateLocalSampleDataSourceItem(RVJsonDataSourceItem jsonItem, string name)
        {
            var localItem = new RVLocalFileDataSourceItem();
            localItem.Uri = "local:/" + name;
            localItem.Id = jsonItem.Title;
            localItem.Title = jsonItem.Title;
            jsonItem.ResourceItem = localItem;
            return jsonItem;
        }
    }
}
