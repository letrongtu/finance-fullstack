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
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponeType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.transactions[
          "bulk-create"
        ]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions created");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary"],
      });
    },
    onError: () => {
      toast.error(
        "Failed to create transactions"
      );
    },
  });

  return mutation;
};
