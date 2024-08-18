import { toast } from "sonner";
import {
  InferRequestType,
  InferResponseType,
} from "hono";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { client } from "@/features/hono";

type ResponeType = InferResponseType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponeType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.transactions[
          "bulk-delete"
        ]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions deleted");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        //TODO: Also invalidate summary
      });
    },
    onError: () => {
      toast.error(
        "Failed to delete transactions"
      );
    },
  });

  return mutation;
};
