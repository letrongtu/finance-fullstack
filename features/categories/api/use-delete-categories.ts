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
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const useDeleteCategory = (
  id?: string
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponeType,
    Error
  >({
    mutationFn: async (json) => {
      const response =
        await client.api.categories[":id"][
          "$delete"
        ]({ param: { id } });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({
        queryKey: ["categories", { id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary"],
      });
    },
    onError: () => {
      toast.error("Failed to delete an category");
    },
  });

  return mutation;
};
