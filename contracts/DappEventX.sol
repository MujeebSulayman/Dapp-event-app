// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract DappEventX is Ownable, ReentrancyGuard, ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _totalEvents;
  Counters.Counter private _totalTokens;

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
    uint256 timestamp;
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
    uint256 timestamp;
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
    eventX.timestamp = currentTime();

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
  function deleteEvent(uint256 eventId) public nonReentrant {
    require(eventExists[eventId], 'Event does not exist');
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthorized access');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(!events[eventId].refunded, 'Event already refunded');
    //Perform refund transaction
    require(refundTickets(eventId), 'Event failed to refund');

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

  //BUY TICKET FUNCTION
  function buyTickets(uint256 eventId, uint256 numOfticket) public payable {
    require(eventExists[eventId], 'Event does not exist');
    require(events[eventId].startsAt > currentTime(), 'Event already started');
    require(
      events[eventId].capacity >= events[eventId].seats + numOfticket,
      'Not enough tickets available'
    );
    require(msg.value >= events[eventId].ticketCost * numOfticket, 'Not enough ether sent');
    require(numOfticket > 0 && numOfticket <= 5, 'Can only buy 1-5 tickets');

    //Create ticket
    for (uint i = 0; i < numOfticket; i++) {
      TicketStruct memory ticket;

      ticket.id = tickets[eventId].length;
      ticket.eventId = eventId;
      ticket.owner = msg.sender;
      ticket.timestamp = currentTime();
      ticket.ticketCost = events[eventId].ticketCost;
      tickets[eventId].push(ticket);
    }

    events[eventId].seats += numOfticket;
    balance = msg.value;
  }

  //GET TICKET FOR SPECIFITC EVENT
  function getTickets(uint256 eventId) public view returns (TicketStruct[] memory) {
    return tickets[eventId];
  }

  //REFUND TICKET FUNCTION
  function refundTickets(uint256 eventId) internal returns (bool) {
    for (uint i = 0; i < tickets[eventId].length; i++) {
      tickets[eventId][i].refunded = true;
      balance -= tickets[eventId][i].ticketCost;
      payTo(tickets[eventId][i].owner, tickets[eventId][i].ticketCost);
    }
    events[eventId].refunded = true;
    return true;
  }

  //PAYOUT TO THE EVENT PLANNER
  function payout(uint256 eventId) public {
    require(eventExists[eventId], 'Event does not exist');
    require(events[eventId].paidOut, 'Event has already been paid out');
    require(currentTime() > events[eventId].endsAt, 'Event is still on going');
    require(
      events[eventId].owner == msg.sender || msg.sender == owner(),
      'Only authorities can send payout'
    );
    require(mintTickets(eventId), 'Event failed to mint');

    uint256 revenue = events[eventId].ticketCost * events[eventId].seats;
    uint256 fee = (revenue * servicePct) / 100;

    payTo(events[eventId].owner, revenue - fee);
    payTo(owner(), fee);
    balance -= revenue;
    events[eventId].paidOut = true;
  }

  //MINTING FUNCTION
  function mintTickets(uint256 eventId) internal returns (bool) {
    for (uint i = 0; i < tickets[eventId].length; i++) {
      _totalTokens.increment();
      tickets[eventId][i].minted = true;
      _mint(tickets[eventId][i].owner, _totalTokens.current());
    }

    events[eventId].minted = true;
    return true;
  }

  //PAYABLE FUNCTION FOR REFUND TICKET TO MAKE TRANSFER EASIER
  function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success);
  }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }
}
