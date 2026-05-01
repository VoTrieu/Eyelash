using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AppointmentAvailabilityController(IUnitOfWork uow): BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<AppointmentAvailabilityBlockDto>>> GetAvailabilityBlocks(
        [FromQuery] AppointmentAvailabilityParams appointmentAvailabilityParams)
    {
        return await uow.AppointmentAvailabilityRepository
            .GetAllAvailabilityBlocksAsync(appointmentAvailabilityParams);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppointmentAvailabilityBlockDto>> GetAvailabilityBlock(int id)
    {
        var block = await uow.AppointmentAvailabilityRepository.GetAvailabilityBlockEntityByIdAsyns(id);

        if (block == null) return NotFound();

        return Ok(block);
    }

    [HttpGet("day")]
    public async Task<ActionResult<IReadOnlyList<AppointmentAvailabilityBlockDto>>> GetAvailabilityBlocksForDay(
        [FromQuery] DateOnly? date
    )
    {
        var blocks = await uow.AppointmentAvailabilityRepository.GetAvailabilityBlocksAsync(date);

        return Ok(blocks);

    }

    [HttpPost]
    public async Task<ActionResult<AppointmentAvailabilityBlockDto>> CreateAvailabilityBlock(
        [FromBody] UpsertAppointmentAvailabilityBlockDto dto)
    {
        if(!Enum.TryParse<AvailabilityBlockType>(dto.Type, true, out var blockType))
        {
            return BadRequest($"Invalid block type: {dto.Type}, The Tyoe must be Working, Blocked or Closed");
        }

        if(dto.StartTime.HasValue && dto.EndTime.HasValue && dto.StartTime.Value >= dto.EndTime.Value)
        {
            return BadRequest("Start time must be before end time");
        }

        var block = new AppointmentAvailabilityBlock
        {
            Date = dto.Date,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Type = blockType,
            Notes = dto.Notes,
            IsActive = dto.IsActive
        };

        uow.AppointmentAvailabilityRepository.AddAvailablityBlock(block);

        if (await uow.CompleteAsync())
        {
            var blocks = await uow.AppointmentAvailabilityRepository.GetAvailabilityBlocksForDateAsync(dto.Date);
            var createdBlock = blocks.FirstOrDefault(b => b.Id == block.Id);
            return Ok(createdBlock);
        }
        return BadRequest("Failed to create availability block");

    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AppointmentAvailabilityBlockDto>> UpdateAvailabilityBlock(
        int id,
        [FromBody] UpsertAppointmentAvailabilityBlockDto dto)
    {
        var block = await uow.AppointmentAvailabilityRepository.GetAvailabilityBlockEntityByIdAsyns(id);
        if (block == null) return NotFound();

        if(!Enum.TryParse<AvailabilityBlockType>(dto.Type, true, out var blockType))
        {
            return BadRequest($"Invalid block type: {dto.Type}. The type must be Working, Blocked or Closed.");
        }

        if(dto.StartTime.HasValue && dto.EndTime.HasValue && dto.StartTime.Value >= dto.EndTime.Value)
        {
            return BadRequest("Start time must be before end time");
        }

        block.Date = dto.Date;
        block.StartTime = dto.StartTime;
        block.EndTime = dto.EndTime;
        block.Type = blockType;
        block.Notes = dto.Notes?.Trim();
        block.IsActive = dto.IsActive;
        block.UpdatedAt = DateTime.UtcNow;

        uow.AppointmentAvailabilityRepository.UpdateAvailabilityBlock(block);

        if (await uow.CompleteAsync())
        {
            var blocks = await uow.AppointmentAvailabilityRepository.GetAvailabilityBlocksAsync(dto.Date);
            var updatedBlock = blocks.FirstOrDefault(b => b.Id == block.Id);
            return Ok(updatedBlock);
        }
        return BadRequest("Failed to update availability block");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteAvailabilityBlock(int id)
    {
        var block = await uow.AppointmentAvailabilityRepository.GetAvailabilityBlockEntityByIdAsyns(id);
        if (block == null) return NotFound();

        uow.AppointmentAvailabilityRepository.DeleteAvailablityBlock(block);

        if(await uow.CompleteAsync())
        {
            return NoContent();
        }
        return BadRequest("Failed to delete availability block");
    }

}
