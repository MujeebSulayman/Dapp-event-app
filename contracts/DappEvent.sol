// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/**
 * @title DappEvent
 * @dev A decentralized event management system with ticket sales functionality.
 * This contract allows users to create, update, and delete events, as well as
 * manage ticket sales. It incorporates NFT functionality for potential ticket
 * tokenization, though this feature is not fully implemented in the current version.
 *
 * Key features:
 * - Event creation and management
 * - Ticket tracking
 * - Basic access control for event owners
 * - Integration with OpenZeppelin's Ownable, ReentrancyGuard, and ERC721 contracts
 *
 * TODO: Implement ticket buying, NFT minting, payout, and refund mechanisms.
 */
contract DappEvent is Ownable, ReentrancyGuard, ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _totalEvents;
  Counters.Counter private _totalToken;

  struct EventStruct {
    uint256 id;
    string title;
    string imageUrl;
    string description;
    address owner;
    uint256 sales;
    uint256 ticketCost;
    uint256 capacity;
    uint256 seats;
    uint256 startsAt;
    uint256 endsAt;
    uint256 timeStamp;
    bool deleted;
    bool paidOut;
    bool refunded;
    bool minted;
  }

  struct TicketStruct {
    uint256 id;
    uint256 eventId;
    address owner;
    uint256 ticketCost;
    uint256 timeStamp;
    bool refunded;
    bool minted;
  }

  uint256 public balance;
  uint256 private servicePct;

  mapping(uint256 => EventStruct) events;
  mapping(uint256 => TicketStruct[]) tickets;
  mapping(uint256 => bool) eventExists;

  constructor(uint256 _pct) ERC721('Event X', 'ETX') {
    servicePct = _pct;
  }

  //CREATE EVENTS
  function createEvent(
    string memory title,
    string memory description,
    string memory imageUrl,
    uint256 capacity,
    uint256 ticketCost,
    uint256 startsAt,
    uint256 endsAt
  ) public {
    require(ticketCost > 0 ether, 'Ticket Cost must be greater than zero');
    require(capacity > 0, 'Capacity must be greater than zero');
    require(bytes(title).length > 0, 'Title must be greater than zero');
    require(bytes(description).length > 0, 'Description must be greater than zero');
    require(bytes(imageUrl).length > 0, 'Image Url can not be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > 0 ether, 'End date must be greater than zero');

    _totalEvents.increment();

    EventStruct memory eventX;

    eventX.id = _totalEvents.current();
    eventX.title = title;
    eventX.description = description;
    eventX.imageUrl = imageUrl;
    eventX.capacity = capacity;
    eventX.ticketCost = ticketCost;
    eventX.startsAt = startsAt;
    eventX.endsAt = endsAt;
    eventX.owner = msg.sender;
    eventX.timeStamp = currentTime();

    eventExists[eventX.id] = true;
    events[eventX.id] = eventX;
  }

  //UPDATE EVENT
  function updateEvent(
    uint256 eventId,
    string memory title,
    string memory description,
    string memory imageUrl,
    uint256 capacity,
    uint256 ticketCost,
    uint256 startsAt,
    uint256 endsAt
  ) public {
    require(eventExists[eventId], 'Event does not exist');
    require(events[eventId].owner == msg.sender, 'Unauthorized access');
    require(ticketCost > 0 ether, 'Ticket Cost must be greater than zero');
    require(capacity > 0, 'Capacity must be greater than zero');
    require(bytes(title).length > 0, 'Title must be greater than zero');
    require(bytes(description).length > 0, 'Description must be greater than zero');
    require(bytes(imageUrl).length > 0, 'Image Url can not be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > 0 ether, 'End date must be greater than zero');

    EventStruct storage eventX = events[eventId];

    eventX.title = title;
    eventX.description = description;
    eventX.imageUrl = imageUrl;
    eventX.capacity = capacity;
    eventX.ticketCost = ticketCost;
    eventX.startsAt = startsAt;
    eventX.endsAt = endsAt;
    events[eventX.id] = eventX;
  }

  //DELETE EVENTS
  function deleteEvent(uint256 eventId) public {
    require(eventExists[eventId], 'Event does not exist');
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthorized access');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(!events[eventId].refunded, 'Event already refunded');

    //Perform refund transaction
    events[eventId].deleted = true;
  }

  //GET ALL EVENTS
  function getEvents() public view returns (EventStruct[] memory Events) {
    uint256 available;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted) available++;
    }

    Events = new EventStruct[](available);

    uint256 index;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted) {
        Events[index++] = events[i];
      }
    }
  }

  //GET MY EVENTS
  function getMyEvents() public view returns (EventStruct[] memory Events) {
    uint256 available;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == msg.sender) available++;
    }

    Events = new EventStruct[](available);

    uint256 index;
    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == msg.sender) {
        Events[index++] = events[i];
      }
    }
  }

  //GET SINGLE EVENT
  function getSingleEvent(uint256 eventId) public view returns (EventStruct memory) {
    require(eventExists[eventId], 'Event does not exist');
    require(!events[eventId].deleted, 'Event already deleted');

    return events[eventId];
  }

  //BUT TICKET FUNTION
 function buyTickets(uint256 eventId, uint256 numOfticket) internal payable {
  require(eventExists[eventId], 'Event does not exist');
  require(events[eventId].startsAt > currentTime(), 'Event already started');
  require(events[eventId].capacity >= events[eventId].seats + numOfticket, 'Not enough tickets available');
  require(msg.value >= events[eventId].ticketCost * numOfticket, 'Not enough ether sent');
  require(numOfticket > 0 && numOfticket <= 5, 'Can only buy 1-5 tickets');

  //Create ticket
  TicketStruct memory ticket;
  
 }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }
}
