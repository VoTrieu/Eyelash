using System;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Data;

public class MappingProfiles: Profile
{
    public MappingProfiles()
    {
        //Service -> ServiceDTo
        CreateMap<Service, ServiceDto>()
            .ForMember(dest => dest.MainPhotoUrl,
            opt => opt.MapFrom(src => src.Photos.Where(p => p.IsMain)
            .Select(p => p.Url)
            .FirstOrDefault()));

        // Service -> Detail
        CreateMap<Service, ServiceDetailDto>()
            .ForMember(dest => dest.MainPhotoUrl,
            opt => opt.MapFrom(src => src.Photos.Where(p => p.IsMain)
            .Select(p => p.Url)
            .FirstOrDefault()));

        // Photo
        CreateMap<Photo, PhotoDto>();

        // Review
         CreateMap<Review, ReviewDto>()
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.ClientName))
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name));

        // Appointment
        CreateMap<Appointment, AppointmentDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<AppointmentSettings, AppointmentSettingsDto>();

        CreateMap<AppointmentAvailabilityBlock, AppointmentAvailabilityBlockDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));



    }

}
