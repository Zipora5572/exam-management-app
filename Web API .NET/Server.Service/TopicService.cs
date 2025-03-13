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
    public class TopicService : ITopicService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public TopicService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<List<Topic>> GetAllTopicsAsync()
        {
            var topics = await _repositoryManager.Topics.GetAllAsync();
            return topics.ToList();
        }

        public async Task<TopicDto> GetByIdAsync(int id)
        {
            Topic topic = await _repositoryManager.Topics.GetByIdAsync(id);
            TopicDto topicDto = _mapper.Map<TopicDto>(topic);
            return topicDto;
        }

        public async Task<TopicDto> AddTopicAsync(TopicDto topicDto)
        {
            Topic topic = _mapper.Map<Topic>(topicDto);
            topic = await _repositoryManager.Topics.AddAsync(topic);
            await _repositoryManager.SaveAsync();
            topicDto = _mapper.Map<TopicDto>(topic);
            return topicDto;
        }

        public async Task DeleteTopicAsync(TopicDto topicDto)
        {
            Topic topic = _mapper.Map<Topic>(topicDto);
            await _repositoryManager.Topics.DeleteAsync(topic);
            await _repositoryManager.SaveAsync();
        }

        public async Task<TopicDto> UpdateTopicAsync(int id, TopicDto topicDto)
        {
            Topic topic = _mapper.Map<Topic>(topicDto);
            topic = await _repositoryManager.Topics.UpdateAsync(id, topic);
            await _repositoryManager.SaveAsync();
            topicDto = _mapper.Map<TopicDto>(topic);
            return topicDto;
        }



    }
}
