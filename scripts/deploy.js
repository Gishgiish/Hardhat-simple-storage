//IMPORTS
const { ethers, run, network } = require("hardhat")

// MAIN ASYNC
async function main() {
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.waitForDeployment()
    console.log(`Deployed contract to: ${simpleStorage.target}`)
    // console.log(network.config)
    // Check network that is in use
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        // wait 6 transactions before verifying the contract
        await simpleStorage.deploymentTransaction().wait(6)
        await verify(simpleStorage.target, [])
    }

    // retrieve the current value
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(8)
    await transactionResponse.wait(1)

    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is: ${updatedValue}`)
}

// verifying the contract
async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [],
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
