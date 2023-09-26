import * as z from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/services/auth";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const SignUpForm = () => {
  const { mutateAsync: registerUser, isLoading: isRegisterUserLoading } =
    useRegister();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const response = await registerUser({
        body: {
          email: values.email,
          password: values.password,
          username: values.username,
        },
      });
      toast.success(response?.data?.message);
      form.reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Unable to create user");
      } else {
        toast.error("Something Went Wrong");
      }
    }
  }
  return (
    <div className="p-5">
      <h2 className="text-xl font-bold text-center mb-5">Sign Up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isRegisterUserLoading}
          >
            {isRegisterUserLoading ? "Please Wait ..." : "SIGN UP"}
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-between mt-5">
        <p className="font-medium text-blue-600">Already have an account?</p>
        <Link
          to="/sign-in"
          className="font-medium hover:text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
