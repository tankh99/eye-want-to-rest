import { calculateTick } from "../time"

jest.useFakeTimers()
jest.spyOn(global, "setInterval")


describe("time.ts", () => {
    it("calculateTick should return formatted duration", () => {
        const now = new Date()

        const callback = jest.fn();
        const duration = calculateTick(5, now, callback);
        expect(duration).toStrictEqual({years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 5});
        expect(callback).not.toHaveBeenCalled()

    })

    it("calculateTick should call onTimerDone", () => {
        const now = new Date()
        const callback = jest.fn();
        const duration = calculateTick(1, now, callback);
        expect(duration).toStrictEqual({years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 1});
        expect(callback).toHaveBeenCalled()
    })
})