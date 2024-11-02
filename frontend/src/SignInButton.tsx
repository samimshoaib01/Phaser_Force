// src/SignInButton.jsx
const SignInButton = () => {
    const handleGoogleSignIn = () => {
        // Redirect to the Google sign-in route on the backend
        window.location.href = "http://localhost:3000/auth/google";
    };

    return (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    );
};

export default SignInButton;
