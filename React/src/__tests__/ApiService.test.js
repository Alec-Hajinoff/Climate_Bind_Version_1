import { fetchPayorCalculations } from "../ApiService";

describe("ApiService", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchPayorCalculations", () => {
    it("should fetch payor calculations successfully", async () => {
      const mockData = { calculations: [{ id: 1, value: 100 }] };
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockData),
        })
      );

      const result = await fetchPayorCalculations();

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Climate_Bind_Development/payor_calculations.php",
        {
          method: "GET",
          credentials: "include",
        }
      );
    });

    it("should handle error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.reject(new Error("Network error"))
      );

      await expect(fetchPayorCalculations()).rejects.toThrow();
    });
  });
});
