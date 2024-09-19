// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

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
    uint256 ticketCosts;
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

    constructor (uint256 _pct) ERC721 ('Event X', 'ETX') {

    servicePct = _pct
    }

    function createEvent( string memory title, string memory description, string memory imageUrl, uint256 capacity, uint256 ticketCost, uint256 startsAt, uint256 endsAt)public {

    }
}
