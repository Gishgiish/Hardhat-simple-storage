const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploySimpleStorage() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners()

        const SimpleStorageFactory =
            await ethers.getContractFactory("SimpleStorage")
        const simpleStorage = await SimpleStorageFactory.deploy()
        await simpleStorage.waitForDeployment()

        return { simpleStorage, owner, otherAccount }
    }

    describe("Deployment", function () {
        it("Should set the favorite number to 0", async function () {
            const { simpleStorage } = await loadFixture(deploySimpleStorage)

            expect(await simpleStorage.retrieve()).to.equal(0)
        })

        it("Should update upon calling store", async function () {
            const { simpleStorage } = await loadFixture(deploySimpleStorage)
            const expectedValue = "7"
            const transactionResponse = await simpleStorage.store(expectedValue)
            await transactionResponse.wait(1)

            const currentValue = await simpleStorage.retrieve()
            expect(currentValue.toString()).to.equal(expectedValue)
        })
    })
})
