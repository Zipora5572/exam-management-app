using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.API.PostModel;
using Server.Core.DTOs;
using Server.Core.Entities;
using Server.Core.IServices;
using Server.Service;

namespace Server.API.Controllers
{
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AuthController(
            IAuthService authService,
            IUserService userService,
            IMapper mapper
            )
        {
            _authService = authService;
            _userService = userService;
            _mapper = mapper;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userService.GetByUserNameAsync(model.Username);
            if (user != null && _authService.VerifyPassword(model.Password, user.PasswordHash))
            {
                var token = _authService.GenerateJwtToken(user.Username, user.Roles);
                var userDto = _mapper.Map<UserDto>(user); 
                return Ok(new { Token = token, User = userDto });
            }
            return Unauthorized();
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserPostModel model)
        {
            var existingUser = await _userService.GetByUserNameAsync(model.Username);
            if (existingUser != null)
            {
                return Conflict("User already exists.");
            }

            var userDto = _mapper.Map<UserDto>(model);
            userDto.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            await _userService.AddUserAsync(userDto);

            var token = _authService.GenerateJwtToken(userDto.Username, userDto.Roles);

            return CreatedAtAction(nameof(Login), new { Token = token, User = userDto });
        }

    }
}
