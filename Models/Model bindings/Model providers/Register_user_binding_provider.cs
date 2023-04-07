using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace Dublongold_site.Models
{
    public class Register_user_binding_provider: IModelBinderProvider
    {
        public IModelBinder? GetBinder(ModelBinderProviderContext context)
        {
            ILoggerFactory logger_factory = context.Services.GetRequiredService<ILoggerFactory>();
            IModelBinder model_binder = new Register_user_binding(new SimpleTypeModelBinder(typeof(User_account), logger_factory));
            return context.Metadata.ModelType == typeof(User_account) ? model_binder : null;
        }
    }
}
