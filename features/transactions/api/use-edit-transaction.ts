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
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

export const useEditTransaction = (
  id?: string
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponeType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.transactions[":id"][
          "$patch"
        ]({ json, param: { id } });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction updated");
      queryClient.invalidateQueries({
        queryKey: ["transactions", { id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary"],
      });
    },
    onError: () => {
      toast.error(
        "Failed to updated transaction"
      );
    },
  });

  return mutation;
};
