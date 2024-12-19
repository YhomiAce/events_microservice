import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from '../services';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/modules/auth/guards';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities';
import { SuccessResponse } from 'src/common/responses';
import { CreateEventDto, EventRequestDto, RequestDecisionDto } from '../dtos';
import { AppStrings } from 'src/common/messages/app.strings';
import { EventQueryDto } from '../dtos';

@ApiTags('Event')
@ApiBearerAuth()
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Create Event
   *
   * @async
   * @param {User} user
   * @param {CreateEventDto} createEventDto
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Create Event',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiUnauthorizedResponse({
    description: 'Unauthorize',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Validation error',
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createEventDto: CreateEventDto,
  ): Promise<SuccessResponse> {
    return {
      message: AppStrings.EVENT_CREATED,
      data: await this.eventService.create(user, createEventDto),
    };
  }

  /**
   * List All user Events
   *
   * @async
   * @param {User} user
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({ summary: 'List All User Events' })
  @ApiOkResponse({ type: SuccessResponse })
  @UseGuards(AccessTokenGuard)
  @Get('user/list')
  async findAllUserEvent(@CurrentUser() user: User): Promise<SuccessResponse> {
    return {
      data: await this.eventService.findAllUserEvent(user),
    };
  }

  /**
   * List All Events
   *
   * @async
   * @param {EventQueryDto} query
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({ summary: 'List All Events' })
  @ApiOkResponse({ type: SuccessResponse })
  @Get()
  async findAll(@Query() query: EventQueryDto): Promise<SuccessResponse> {
    return {
      data: await this.eventService.findAll(query),
    };
  }

  /**
   * Find Event
   *
   * @async
   * @param {string} id
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({ summary: 'Find Event' })
  @ApiOkResponse({ type: SuccessResponse })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse> {
    return {
      data: await this.eventService.findOne(id),
    };
  }

  /**
   * Send Request to Join Event
   *
   * @async
   * @param {User} user
   * @param {EventRequestDto} eventRequestDto
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Request to Join Event',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({
    description: 'Bad Request: Validation error',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(AccessTokenGuard)
  @Post('requests/join')
  async joinEventRequest(
    @CurrentUser() user: User,
    @Body() eventRequestDto: EventRequestDto,
  ): Promise<SuccessResponse> {
    return {
      message: AppStrings.JOIN_EVENT_REQUEST,
      data: await this.eventService.joinEventRequest(user, eventRequestDto),
    };
  }

  /**
   * Find All Event Request
   *
   * @async
   * @param {User} user
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({ summary: 'Find All Event Request' })
  @ApiOkResponse({ type: SuccessResponse })
  @UseGuards(AccessTokenGuard)
  @Get('requests/list')
  async eventRequests(@CurrentUser() user: User): Promise<SuccessResponse> {
    return {
      data: await this.eventService.requestList(user),
    };
  }

  /**
   * Accept/Reject Join Request
   *
   * @async
   * @param {User} user
   * @param {RequestDecisionDto} requestDecisionDto
   * @returns {Promise<SuccessResponse>}
   */
  @ApiOperation({
    summary: 'Accept/Reject Join Request',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBadRequestResponse({
    description: 'Bad Request: Validation error',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(AccessTokenGuard)
  @Post('requests/action')
  async requestDecision(
    @CurrentUser() user: User,
    @Body() requestDecisionDto: RequestDecisionDto,
  ): Promise<SuccessResponse> {
    return {
      message: await this.eventService.acceptOrRejectJoinRequest(
        user,
        requestDecisionDto,
      ),
    };
  }
}
