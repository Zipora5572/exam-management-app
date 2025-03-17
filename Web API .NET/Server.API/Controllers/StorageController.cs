using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Core.IServices;
using Server.Service;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : ControllerBase
    {
        private readonly IGoogleStorageService _googleStorageService;

        public StorageController(IGoogleStorageService googleStorageService)
        {
            _googleStorageService = googleStorageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var objectName = file.FileName;
            var filePath = Path.Combine(Path.GetTempPath(), objectName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            await _googleStorageService.UploadFileAsync(filePath, objectName);

            
            System.IO.File.Delete(filePath);

            return Ok($"File {objectName} uploaded successfully.");
        }
    }
}
