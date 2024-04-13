import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { Console } from "console";

// Load environment variables
dotenv.config();

class BoathouseApi {
  private boathouseApi: string;
  private boathousePortalID: string;
  private boathouseSecret: string;

  constructor() {
    this.boathouseApi = process.env.BOATHOUSE_API || "";
    this.boathousePortalID = process.env.BOATHOUSE_PORTAL_ID || "";
    this.boathouseSecret = process.env.BOATHOUSE_SECRET || "";
  }

  public async getBoathouseResponse(
    email?: string | null,
    customerID?: string | null,
    returnUrl?: string | null
  ): Promise<any | null> {
    try {
      const response = await axios.post(this.boathouseApi, {
        portalId: this.boathousePortalID,
        secret: this.boathouseSecret,
        email: email,
        paddleCustomerId: customerID,
        returnUrl: returnUrl,
      });

      const result = response.data;

      return result;
    } catch (error) {
      if ((error as AxiosError) && (error as AxiosError).response) {
        console.debug((error as AxiosError).response?.data);
      } else if (error instanceof AxiosError) {
        console.debug((error as AxiosError).message);
      } else {
        console.error("An unexpected error occurred");
      }
      return null;
    }
  }
}

class BoathouseResponse {
  paddleCustomerID: string | undefined;
  billingPortalUrl: string | undefined;
  pricingTableHtml: string | undefined;
  activeSubscriptions: any[] | undefined;
}

export { BoathouseApi, BoathouseResponse };
