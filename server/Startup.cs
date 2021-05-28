using System;
using System.IO;
using System.IO.Compression;
using Server.RevealSDK;
using Reveal.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Hosting;

namespace Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Filter out the Reveal Embed endpoints from swagger docs.
            services.AddSwaggerGen( o =>
            {
                o.SwaggerGeneratorOptions.DocInclusionPredicate = (str, desc) => {
                    var controllerActionDescriptor = desc.ActionDescriptor as ControllerActionDescriptor;
                    if (controllerActionDescriptor != null)
                    {
                        bool isRevealController = controllerActionDescriptor.ControllerTypeInfo.AssemblyQualifiedName.Contains("Infragistics.Reveal.");
                        return !isRevealController;
                    }
                    return true;
                }; 
            });
            services.AddRevealServices(new RevealEmbedSettings
            {
                LocalFileStoragePath = Path.Combine(Directory.GetCurrentDirectory(), "Data")
            }, new RevealSdkContext());

            services.AddControllers().AddReveal();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = "api";
            });

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
