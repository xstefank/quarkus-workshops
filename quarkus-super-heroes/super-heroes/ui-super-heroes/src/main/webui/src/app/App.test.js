import React from "react"
import {fireEvent, render, screen} from "@testing-library/react"
import App from "./App"
import "@testing-library/jest-dom"
import {act} from "react-dom/test-utils"
import {getFights, getRandomFighters, startFight} from "./shared/api/fight-service"

jest.mock("./shared/api/fight-service")

const fighters = {
  hero: {
    name: 'Fake hero',
    level: 1,
    picture: 'https://dummyimage.com/280x380/1e8fff/ffffff&text=Fake+Hero',
    powers: 'Fake hero powers'
  },
  villain: {
    name: 'Fake villain',
    level: 42,
    picture: 'https://dummyimage.com/280x380/b22222/ffffff&text=Fake+Villain',
    powers: 'Fake villain powers'
  }
}

const location = {
  name: "Gotham City",
  picture: 'https://dummyimage.com/280x380/b22222/ffffff&text=Gotham',
  description: "This is Gotham City"
}

const fight = {
  fightDate: "2023-10-24T21:34:47.617598Z",
  id: 200,
  loserLevel: 1,
  loserName: "Some hero",
  loserPicture: "https://dummyimage.com/280x380/1e8fff/ffffff&text=Mock+Hero",
  loserPowers: "Being fake",
  loserTeam: "heroes",
  winnerLevel: 42,
  winnerName: "Some villain",
  winnerPicture: "https://dummyimage.com/280x380/b22222/ffffff&text=Mock+Villain",
  winnerPowers: "Dissimulation",
  winnerTeam: "villains",
  location: location
}

describe("renders the elements", () => {
  beforeEach(() => {
    getRandomFighters.mockResolvedValue(fighters)
    startFight.mockResolvedValue(fight)

    // To make the row-counting test work, we need the behaviour of getFights to change on each call
    getFights.mockResolvedValueOnce([fight])
    getFights.mockResolvedValueOnce([{...fight, id: 201}, fight])
    getFights.mockResolvedValueOnce([{...fight, id: 202}, {...fight, id: 201}, fight])
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('renders a suitable title', async () => {
    await act(async () => {
      render(<App/>)
    })

    expect(screen.getByText(/Super Heroes/i)).toBeInTheDocument()
  })

  it("renders a table with column headings", async () => {
    await act(async () => {
      render(<App/>)
    })
    expect(screen.getByText("Fight Date")).toBeInTheDocument()
  })

  it("renders fighters", async () => {
    await act(async () => {
      render(<App/>)
    })
    expect(screen.getByText("Fake hero")).toBeInTheDocument()
    expect(screen.getByText("Fake villain")).toBeInTheDocument()
    expect(screen.getByText(/FIGHT !/)).toBeInTheDocument()
  })

  it("refreshes the fight list on a fight", async () => {
    await act(async () => {
      render(<App/>)
    })
    const getFightCallCount = getFights.mock.calls.length
    await act(async () => {
      fireEvent.click(screen.getByText(/FIGHT !/i))
    })
    expect(getFights).toHaveBeenCalledTimes(getFightCallCount + 1)
  })

  it("renders a new fight row on a fight", async () => {
    await act(async () => {
      render(<App/>)
    })

    // Do a fight, to get all the fight output populated so we can count properly
    await act(async () => {
      fireEvent.click(screen.getByText(/FIGHT !/i))
    })

    const winnerCount = screen.queryAllByText("Some villain").length
    await act(async () => {
      fireEvent.click(screen.getByText(/FIGHT !/i))
    })
    // There should be an extra row, which means an extra occurence of the villain name
    expect(screen.queryAllByText("Some villain")).toHaveLength(winnerCount + 1)
  })
})
