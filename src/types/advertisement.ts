import { z } from "zod";
import { formSchema } from "@/components/advertisement/advertisementSchema";

export type StyleType = z.infer<typeof formSchema>["style"];
export type ServiceLocationType = z.infer<typeof formSchema>["serviceLocations"][number];
export type FormValues = z.infer<typeof formSchema>;