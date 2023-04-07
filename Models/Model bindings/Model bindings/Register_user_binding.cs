using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Dublongold_site.Models
{
    public class Register_user_binding : IModelBinder
    {
        private readonly IModelBinder fallback;
        public Register_user_binding(IModelBinder fallback)
        {
            this.fallback = fallback;
        }
        public Task BindModelAsync(ModelBindingContext context)
        {
            ValueProviderResult register_user_name = context.ValueProvider.GetValue("user-name-for-register");
            ValueProviderResult register_user_surname = context.ValueProvider.GetValue("user-surname-for-register");
            ValueProviderResult register_user_login = context.ValueProvider.GetValue("user-login-for-register");
            ValueProviderResult register_user_password = context.ValueProvider.GetValue("user-password-for-register");
            ValueProviderResult register_user_email = context.ValueProvider.GetValue("user-email-for-register");
            ValueProviderResult vprn = ValueProviderResult.None;
            if(register_user_name == vprn || register_user_surname == vprn
                || register_user_login == vprn || register_user_password == vprn
                || register_user_email == vprn)
                return fallback.BindModelAsync(context);

            string? user_name = register_user_name.FirstValue;
            string? user_surname = register_user_surname.FirstValue;
            string? user_login= register_user_login.FirstValue;
            string? user_password = register_user_password.FirstValue;
            string? user_email = register_user_email.FirstValue;

            User_account? user_account = null;

            if (user_name is not null && user_surname is not null && user_login is not null
                && user_password is not null && user_email is not null)
                user_account = new() {
                    Name = user_name, Surname = user_surname, Login = user_login,
                    Password = user_password, Email = user_email };
            if (user_account is not null)
                context.Result = ModelBindingResult.Success(user_account);
            else
                return fallback.BindModelAsync(context);

            return Task.CompletedTask;
        }
    }
}
