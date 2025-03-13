using AutoMapper;
using Server.API.PostModel;
using Server.Core.DTOs;

namespace Server.API
{
    public class MappingPostProfile:Profile
    {
        public MappingPostProfile()
        {
            CreateMap<UserPostModel, UserDto>();
            CreateMap<ExamPostModel, ExamDto>();
            CreateMap<RolePostModel, RoleDto>();
            CreateMap<PermissionPostModel, PermissionDto>();
            CreateMap<TagPostModel, TagDto>();
            CreateMap<TopicPostModel, TopicDto>();
        }
    }
}
