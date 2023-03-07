// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Twitter {

    // Define a struct to store information about a single tweet
    struct Tweet {
        address account; // The address of the user who tweeted.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user tweeted.
    }

    // Event that is emitted every time a new tweet is added
    event NewTweet(address indexed from, uint256 timestamp, string message);

    // Array to store all tweets sent through the contract
    Tweet[] public tweets;

    // Keep track of the total number of tweets sent
    uint public totalTweets;

    /**
     * Returns all tweets in the system
     *
     * @return Tweet[] memory An array of all tweets in the system
     */
    function getFeed() external view returns (Tweet[] memory) {
        
        // Initialize the result array
        Tweet[] memory result = new Tweet[](tweets.length);

        // Iterate over the tweets collection to build the result array
        for (uint i = 0; i < tweets.length; i++) {
            result[i] = tweets[i];
        }

        // Return the result array
        return result;
    }

    /**
     * Allows a user to tweet a message
     *
     * @param message The message to tweet (as a string)
     */
    function tweet(string calldata message) external {
        // Ensure the message is within the character limit
        require(bytes(message).length <= 500, "Too many bytes.");

        // Add a new tweet to the collection
        Tweet memory newTweet = Tweet({
            account: msg.sender,
            message: message,
            timestamp: block.timestamp
        });

        tweets.push(newTweet);

        // Increment the totalTweets counter
        totalTweets++;

        // Emit the NewTweet event
        emit NewTweet(msg.sender, block.timestamp, newTweet.message);
    }

    /**
     * Returns the total number of tweets sent through the contract
     *
     * @return uint256 The total number of tweets
     */
    function getTotalTweets() external view returns (uint256) {
        return totalTweets;
    }

}