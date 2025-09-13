'use client'

function ForgotPass() {
    return (<div>not impl</div>)

    // return (
    //     <div style={{ maxWidth: 500, marginInline: "auto" }}>
    //         <h2 className="text-uppercase mb-3">Forgot your password?</h2>
    //         <h4 className="lead">We've got you covered.</h4>
    //         <p className="text-muted disply-6">
    //             Confirm your email and we'll send instructions.
    //         </p>
    //
    //         <Form onSubmit={formik.handleSubmit}>
    //             <Form.Group className="mb-3">
    //                 <Form.Label>Email address</Form.Label>
    //                 <Form.Control
    //                     id="email"
    //                     name="email"
    //                     type="email"
    //                     value={formik.values.email}
    //                     onChange={formik.handleChange}
    //                     onBlur={formik.handleBlur}
    //                     placeholder="Enter Email"
    //                     tabIndex={1}
    //                 />
    //
    //                 {formik.touched.email && formik.errors.email ? (
    //                     <Form.Text className="text-danger">{formik.errors.email}</Form.Text>
    //                 ) : null}
    //             </Form.Group>
    //
    //             <Button
    //                 variant="primary"
    //                 type="submit"
    //                 className="text-uppercase"
    //                 disabled={loginLoading}
    //                 tabIndex={3}
    //             >
    //                 {loginLoading ? "Loading..." : "Confirm"}
    //             </Button>
    //         </Form>
    //     </div>
    // );
}

export default ForgotPass;
