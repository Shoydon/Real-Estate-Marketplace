//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstate {
    struct Apartment {
        address owner;
        uint256 apartmentId;
        uint256 buildingId;
        // bool owned;
    }
    struct Building {
        uint buildingId;
        address lister;
        uint listerBuildingId;
        // Apartment[] apartments;
        // mapping (uint => Apartment) apartments;
        uint256 apartmentsCount;
        address[] apartmentOwners;
        uint256 apartmentsOwned;
        uint256 apartmentPrice;
        string ipfsHash;
        bool soldOut;
    }
    struct User {
        address addr;
        Building[] buildingsListed;
        Apartment[] apartmentsOwned;
    }

    mapping(address => User) public users;
    uint256 public buildingsCount;
    Building[] public buildings;

    function listBuilding(
        uint256 _apartmentsCount,
        uint256 _apartmentPrice,
        string memory _ipfsHash
    ) public {
        Building memory building = Building({
            buildingId: buildingsCount,
            lister: msg.sender,
            listerBuildingId: users[msg.sender].buildingsListed.length,
            apartmentsCount: _apartmentsCount,
            apartmentOwners: new address[](0),
            apartmentsOwned: 0,
            apartmentPrice: _apartmentPrice,
            ipfsHash: _ipfsHash,
            soldOut: false
        });
        buildings.push(building);
        users[msg.sender].addr = msg.sender;
        users[msg.sender].buildingsListed.push(building);
        buildingsCount++;
    }

    function buyApartment(uint256 _buildingId, uint256 _apartmentCount) public payable {
        require(_apartmentCount > 0, "Enter number of apartments");
        require(buildings[_buildingId].apartmentsOwned + _apartmentCount <= buildings[_buildingId].apartmentsCount, "not enough apartments");
        require(msg.value >= buildings[_buildingId].apartmentPrice * _apartmentCount, "insufficient funds");
        require(buildings[_buildingId].lister != msg.sender, "cannot buy own building apartments");

        for(uint i = buildings[_buildingId].apartmentsOwned; i < _apartmentCount + buildings[_buildingId].apartmentsOwned; i++) {
            buildings[_buildingId].apartmentOwners.push(msg.sender);
            users[msg.sender].apartmentsOwned.push(Apartment(msg.sender, i, _buildingId));
        }
        buildings[_buildingId].apartmentsOwned += _apartmentCount;
        if(buildings[_buildingId].apartmentsOwned == buildings[_buildingId].apartmentsCount){
            address _buildingOwner = buildings[_buildingId].lister;
            uint _listerBuildingId = buildings[_buildingId].listerBuildingId;
            users[_buildingOwner].buildingsListed[_listerBuildingId].soldOut = true;
            buildings[_buildingId].soldOut = true;
        }
    }

    function allBuildings() public view returns (Building[] memory) {
        return buildings;
    }

    function myApartments() public view returns (Apartment[] memory){
        return users[msg.sender].apartmentsOwned;
    }

    function myListedBuildings() public view returns (Building[] memory){
        return users[msg.sender].buildingsListed;
    }
}
