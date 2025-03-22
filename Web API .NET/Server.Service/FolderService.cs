using AutoMapper;
using Server.Core.DTOs;

using Server.Core.Entities;
using Server.Core.IRepositories;
using Server.Core.IServices;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Service
{
    public class FolderService : IFolderService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public FolderService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<List<Folder>> GetAllFoldersAsync()
        {
            
            var Folders = await _repositoryManager.Folders.GetAllAsync();
            return Folders.ToList();
        }

        public async Task<FolderDto> GetByIdAsync(int id)
        {
           
            Folder Folder = await _repositoryManager.Folders.GetByIdAsync(id);
            FolderDto FolderDto = _mapper.Map<FolderDto>(Folder);
                return FolderDto;
           
        }

        public async Task<FolderDto> AddFolderAsync(FolderDto folderDto)
        {
            Folder folder = _mapper.Map<Folder>(folderDto);
            folder = await _repositoryManager.Folders.AddAsync(folder);
            await _repositoryManager.SaveAsync();
            folderDto = _mapper.Map<FolderDto>(folder);
            return folderDto;
        }

        //public async Task DeleteFolderAsync(FolderDto FolderDto)
        //{
        //    Folder Folder = _mapper.Map<Folder>(FolderDto);
        //   await _repositoryManager.Folders.DeleteAsync(Folder);
        //    await _repositoryManager.SaveAsync();
        //}

        public async Task<FolderDto> UpdateFolderAsync(int id, FolderDto folderDto)
        {
            Folder folder = _mapper.Map<Folder>(folderDto);
            folder = await _repositoryManager.Folders.UpdateAsync(id, folder);
            await _repositoryManager.SaveAsync();
            folderDto = _mapper.Map<FolderDto>(folder);
            return folderDto;
        }
    }
}
