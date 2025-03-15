﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Server.API.PostModel; 
using Server.Core.DTOs; 
using Server.Core.Entities;
using Server.Core.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // GET: api/<UserController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> Get()
        {
            List<User> users = await _userService.GetAllUsersAsync();
            if (users == null)
            {
                return NotFound();
            }
            var userDtos = _mapper.Map<List<UserDto>>(users);
            return Ok(userDtos);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            UserDto user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        // POST api/<UserController>
        [HttpPost]
        public async Task<ActionResult<UserDto>> Post([FromBody] UserPostModel userPostModel)
        {
            if (userPostModel == null)
            {
                return BadRequest("User cannot be null");
            }
            var userDto = _mapper.Map<UserDto>(userPostModel);
            userDto = await _userService.AddUserAsync(userDto);
            if (userDto == null)
            {
                return BadRequest("Added failed");
            }
            return CreatedAtAction(nameof(Get), new { id = userDto.Id }, userDto);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, [FromBody] UserPostModel userPostModel)
        {
            if (userPostModel == null)
            {
                return BadRequest("User cannot be null");
            }

            var existingUserDto = await _userService.GetByIdAsync(id);
            if (existingUserDto == null)
            {
                return NotFound();
            }

            // אם הלקוח שלח סיסמה חדשה, נבצע hashing על הסיסמה החדשה
            if (!string.IsNullOrEmpty(userPostModel.Password))
            {
                existingUserDto.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userPostModel.Password);
            }

            // עכשיו נעדכן את כל יתר השדות (למשל שם, טלפון, כתובת) אם יש שינויים
            existingUserDto.firstName = userPostModel.FirstName;
            existingUserDto.lastName = userPostModel.LastName;
            existingUserDto.PhoneNumber = userPostModel.PhoneNumber;
            existingUserDto.Address = userPostModel.Address;

            // עדכון המשתמש ב-DB
            var updatedUserDto = await _userService.UpdateUserAsync(id, existingUserDto);

            return Ok(updatedUserDto);
        }


        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            UserDto user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            await _userService.DeleteUserAsync(user);
            return NoContent();
        }
    }
}
