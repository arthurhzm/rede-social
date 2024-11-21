using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;

namespace api.Filters{
    public class AuthFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userId = context.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

            if (userId.IsNullOrEmpty())
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Usuário não autenticado" });
                return;
            }

            await next();
        }
        
    }

}