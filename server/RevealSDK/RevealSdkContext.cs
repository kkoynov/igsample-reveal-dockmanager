using Reveal.Sdk;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Server.RevealSDK
{
	public class RevealSdkContext : RevealSdkContextBase
    {
        public RevealSdkContext()
        {
        }

        public override IRVDataSourceProvider DataSourceProvider => new LocalSampleDataSourceProvider();

        public override IRVDataProvider DataProvider => null;

        public override IRVAuthenticationProvider AuthenticationProvider => null;

        public override Task<Dashboard> GetDashboardAsync(string dashboardId)
        {
            string currentDirectory = Directory.GetCurrentDirectory();

            var fileName = Path.Combine(currentDirectory, "DashboardFile", dashboardId);
            using (new FileStream(fileName, FileMode.Open, FileAccess.Read))
            {
                return Task.FromResult(new Dashboard(new FileStream(fileName, FileMode.Open, FileAccess.Read)));
            }
        }


        public override async Task SaveDashboardAsync(string userId, string dashboardId, Dashboard dashboard)
        {
			// "~" is added to the saved .rdash file. (Please overwrite manually)
            //var fileName = Path.Combine(_webRootPath, "App_Data", "DashboardFile", "~"+dashboardId);
            //using (var fileStream = new FileStream(fileName, FileMode.Create, FileAccess.Write))
            //{
            //    (await dashboard.SerializeAsync()).CopyTo(fileStream);
            //}

            //return;
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
