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
  (typeof client.api.accounts)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponeType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts[
        ":id"
      ]["$patch"]({ json, param: { id } });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account updated");
      queryClient.invalidateQueries({
        queryKey: ["accounts", { id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      // TODO: Invalidate summary
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: () => {
      toast.error("Failed to updated an account");
    },
  });

  return mutation;
};
