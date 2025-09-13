import { AuthLayout } from "@/components/auth/layout";
import { LoginForm } from "@/components/auth/login-form";

function LoginPage() {
    return (
        <AuthLayout title="Login" subtitle="Login to your account">
            <LoginForm />
        </AuthLayout>
    )
}

export default LoginPage;

// 'use client'
// import React from 'react';
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Link from "next/link";
// import { useFormik } from "formik";
// import * as Yup from "yup";
//
// import { useRouter } from 'next/navigation'
//
// import { login } from "@/redux/actions";
// import { useAppDispatch, useAppSelector } from "@/redux/store";
//
// function Login() {
//     const dispatch = useAppDispatch();
//     const loginLoading = useAppSelector(({ auth }) => auth.user_loading);
//     const router = useRouter()
//
//     const formik = useFormik({
//         initialValues: {
//             email: "",
//             password: "",
//         },
//         validationSchema: Yup.object({
//             email: Yup.string()
//             .email("Email address is invalid")
//             .required("Email is required"),
//             password: Yup.string().required("Password is required"),
//         }),
//         onSubmit: (values, actions) => {
//             // alert(JSON.stringify(values, null, 2));
//             function alterFormToAPIResult(error: any) {
//                 if (error) {
//                     console.log(error)
//                     actions.setFieldTouched("password", false);
//                     actions.setFieldValue("password", "");
//                 }
//             }
//             dispatch(login(values, alterFormToAPIResult));
//             router.replace("/")
//         },
//     });
//
//     return (
//         <div style={{ maxWidth: 500, marginInline: "auto" }}>
//             <h2 className="text-uppercase mb-3">Login to your account.</h2>
//
//             <Form onSubmit={formik.handleSubmit}>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Email address</Form.Label>
//                     <Form.Control
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formik.values.email}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         placeholder="Enter Email"
//                         tabIndex={1}
//                     />
//
//                     {formik.touched.email && formik.errors.email ? (
//                         <Form.Text className="text-danger">{formik.errors.email}</Form.Text>
//                     ) : null}
//                 </Form.Group>
//
//                 <Form.Group className="mb-3">
//                     <Form.Label>Password</Form.Label>
//                     <div className="position-relative">
//                         <Link href="/auth/forgot-pass">
//                             <Form.Text
//                                 className="text-primary m-0 text-decoration-none"
//                                 style={{
//                                     position: "absolute",
//                                     right: 0,
//                                     transform: "translateY(-100%)",
//                                 }}
//                                 tabIndex={5}
//                             >
//                                 Forgot password?
//                             </Form.Text>
//                         </Link>
//                         <Form.Control
//                             id="password"
//                             name="password"
//                             type="password"
//                             value={formik.values.password}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             placeholder="Enter Password"
//                             tabIndex={2}
//                         />
//                     </div>
//
//                     {formik.touched.password && formik.errors.password ? (
//                         <Form.Text className="text-danger">
//                             {formik.errors.password}
//                         </Form.Text>
//                     ) : null}
//                 </Form.Group>
//
//                 <Button
//                     variant="primary"
//                     type="submit"
//                     className="text-uppercase"
//                     disabled={loginLoading}
//                     tabIndex={3}
//                 >
//                     {loginLoading ? "Loading..." : "Submit"}
//                 </Button>
//
//                 <p className="text-muted fst-italic mt-1">
//                     Don't have an account yet?{" "}
//                     <Link href="/auth/signup" tabIndex={4}>
//                         Sign Up here
//                     </Link>
//                 </p>
//             </Form>
//         </div>
//     );
// }
//
// export default Login;
