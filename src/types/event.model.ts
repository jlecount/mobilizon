import { Address } from "@/types/address.model";
import type { IAddress } from "@/types/address.model";
import type { ITag } from "@/types/tag.model";
import type { IMedia } from "@/types/media.model";
import type { IComment } from "@/types/comment.model";
import type { Paginate } from "@/types/paginate";
import { Actor, displayName, Group } from "./actor";
import type { IActor, IGroup, IPerson } from "./actor";
import type { IParticipant } from "./participant.model";
import { EventOptions } from "./event-options.model";
import type { IEventOptions } from "./event-options.model";
import { EventJoinOptions, EventStatus, EventVisibility } from "./enums";
import { IEventMetadata, IEventMetadataDescription } from "./event-metadata";
import { IConversation } from "./conversation";

export interface IEventCardOptions {
  hideDate?: boolean;
  loggedPerson?: IPerson | boolean;
  hideDetails?: boolean;
  organizerActor?: IActor | null;
  isRemoteEvent?: boolean;
  isLoggedIn?: boolean;
}

export interface IEventParticipantStats {
  notApproved: number;
  notConfirmed: number;
  rejected: number;
  participant: number;
  creator: number;
  moderator: number;
  administrator: number;
  going: number;
}

export type EventType = "IN_PERSON" | "ONLINE" | null;

interface IEventEditJSON {
  id?: string;
  title: string;
  description: string;
  beginsOn: string | null;
  endsOn: string | null;
  status: EventStatus;
  visibility: EventVisibility;
  joinOptions: EventJoinOptions;
  externalParticipationUrl: string | null;
  draft: boolean;
  picture?: IMedia | { mediaId: string } | null;
  attributedToId: string | null;
  organizerActorId?: string;
  onlineAddress?: string;
  phoneAddress?: string;
  physicalAddress?: IAddress;
  tags: string[];
  options: IEventOptions;
  contacts: { id?: string }[];
  metadata: IEventMetadata[];
  category: string;
}

export interface IEvent {
  id?: string;
  uuid: string;
  url: string;
  local: boolean;

  title: string;
  slug: string;
  description: string;
  beginsOn: string;
  endsOn: string | null;
  publishAt: string;
  longEvent: boolean;
  status: EventStatus;
  visibility: EventVisibility;
  joinOptions: EventJoinOptions;
  externalParticipationUrl: string | null;
  draft: boolean;

  picture: IMedia | null;

  organizerActor?: IActor;
  attributedTo?: IGroup;
  participantStats: IEventParticipantStats;
  participants: Paginate<IParticipant>;

  relatedEvents: IEvent[];
  comments: IComment[];
  conversations: Paginate<IConversation>;

  onlineAddress?: string;
  phoneAddress?: string;
  physicalAddress: IAddress | null;

  tags: ITag[];
  options: IEventOptions;
  metadata: IEventMetadataDescription[];
  contacts: IActor[];
  language: string;
  category: string;

  toEditJSON?(): IEventEditJSON;
}

export interface IEditableEvent extends Omit<IEvent, "beginsOn"> {
  beginsOn: string | null;
}
export class EventModel implements IEvent {
  id?: string;

  beginsOn = new Date().toISOString();

  endsOn: string | null = new Date().toISOString();

  title = "";

  url = "";

  uuid = "";

  slug = "";

  description = "";

  local = true;

  onlineAddress: string | undefined = "";

  phoneAddress: string | undefined = "";

  physicalAddress: IAddress | null = null;

  picture: IMedia | null = null;

  visibility = EventVisibility.PUBLIC;

  joinOptions = EventJoinOptions.FREE;

  externalParticipationUrl: string | null = null;

  status = EventStatus.CONFIRMED;

  draft = true;

  publishAt = new Date().toISOString();

  longEvent = false;

  language = "und";

  participantStats = {
    notApproved: 0,
    notConfirmed: 0,
    rejected: 0,
    participant: 0,
    moderator: 0,
    administrator: 0,
    creator: 0,
    going: 0,
  };

  participants!: Paginate<IParticipant>;

  relatedEvents: IEvent[] = [];

  comments: IComment[] = [];

  conversations!: Paginate<IConversation>;

  attributedTo?: IGroup = new Group();

  organizerActor?: IActor = new Actor();

  tags: ITag[] = [];

  contacts: IActor[] = [];

  options: IEventOptions = new EventOptions();

  metadata: IEventMetadataDescription[] = [];

  category = "MEETING";

  constructor(hash?: IEvent | IEditableEvent) {
    if (!hash) return;

    this.id = hash.id;
    this.uuid = hash.uuid;
    this.url = hash.url;
    this.local = hash.local;

    this.title = hash.title;
    this.slug = hash.slug;
    this.description = hash.description || "";

    if (hash.beginsOn) {
      this.beginsOn = new Date(hash.beginsOn).toISOString();
    }
    if (hash.endsOn) {
      this.endsOn = new Date(hash.endsOn).toISOString();
    } else {
      this.endsOn = null;
    }

    this.publishAt = new Date(hash.publishAt).toISOString();

    this.status = hash.status;
    this.visibility = hash.visibility;
    this.joinOptions = hash.joinOptions;
    this.externalParticipationUrl = hash.externalParticipationUrl;
    this.draft = hash.draft;

    this.picture = hash.picture;

    this.organizerActor = new Actor(hash.organizerActor);
    this.attributedTo = new Group(hash.attributedTo);
    this.participants = hash.participants;

    this.relatedEvents = hash.relatedEvents;

    this.onlineAddress = hash.onlineAddress;
    this.phoneAddress = hash.phoneAddress;
    this.physicalAddress = hash.physicalAddress
      ? new Address(hash.physicalAddress)
      : null;
    this.participantStats = hash.participantStats;

    this.contacts = hash.contacts;

    this.tags = hash.tags;
    this.metadata = hash.metadata;
    this.language = hash.language;
    this.category = hash.category;
    if (hash.options) this.options = hash.options;
  }

  toEditJSON(): IEventEditJSON {
    return toEditJSON(this);
  }
}

export function removeTypeName(entity: any): any {
  if (entity?.__typename) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename, ...purgedEntity } = entity;
    return purgedEntity;
  }
  return entity;
}

export function toEditJSON(event: IEditableEvent): IEventEditJSON {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    beginsOn: event.beginsOn ? event.beginsOn.toString() : null,
    endsOn: event.endsOn ? event.endsOn.toString() : null,
    status: event.status,
    category: event.category,
    visibility: event.visibility,
    joinOptions: event.joinOptions,
    externalParticipationUrl: event.externalParticipationUrl,
    draft: event.draft,
    tags: event.tags.map((t) => t.title),
    onlineAddress: event.onlineAddress,
    phoneAddress: event.phoneAddress,
    physicalAddress: removeTypeName(event.physicalAddress),
    options: removeTypeName(event.options),
    metadata: event.metadata.map(({ key, value, type, title }) => ({
      key,
      value,
      type,
      title,
    })),
    attributedToId:
      event.attributedTo && event.attributedTo.id
        ? event.attributedTo.id
        : null,
    contacts: event.contacts.map(({ id }) => ({
      id,
    })),
  };
}

export function organizer(event: IEvent): IActor | null {
  if (event.attributedTo?.id) {
    return event.attributedTo;
  }
  if (event.organizerActor) {
    return event.organizerActor;
  }
  return null;
}

export function organizerAvatarUrl(event: IEvent): string | null {
  return organizer(event)?.avatar?.url ?? null;
}

export function organizerDisplayName(event: IEvent): string | null {
  const organizerActor = organizer(event);
  if (organizerActor) {
    return displayName(organizerActor);
  }
  return null;
}

export function instanceOfIEvent(object: any): object is IEvent {
  return "organizerActor" in object;
}
