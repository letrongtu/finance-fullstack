import { toast } from "sonner";
import {
  InferRequestType,
  InferResponseType,
} from "hono";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponeType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponeType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.categories[":id"][
          "$patch"
        ]({ json, param: { id } });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({
        queryKey: ["categories", { id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error("Failed to update an category");
    },
  });

  return mutation;
};
