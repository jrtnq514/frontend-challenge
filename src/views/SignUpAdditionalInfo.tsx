import React, { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Checkbox,
  Link,
} from "@chakra-ui/react";
import { useSignUpState } from "src/contexts/signUpStateContext";
import { useForm, SubmitHandler } from "react-hook-form";

export interface SignUpAdditionalInfoInputs {
  favoriteColor: string;
  agreeTermsAndConditions: boolean;
}

const SignUpAdditionalInfo: React.FC = () => {
  const navigate = useNavigate();
  const { signUpState, setSignUpState } = useSignUpState();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<SignUpAdditionalInfoInputs>({
    defaultValues: { agreeTermsAndConditions: false },
  });
  const colors = useLoaderData() as string[];

  useEffect(() => {
    if (!signUpState.firstName || !signUpState.email || !signUpState.password) {
      navigate("/");
    }

    if (signUpState.favoriteColor) {
      setValue("favoriteColor", signUpState.favoriteColor);
    }
  }, []);

  useEffect(() => {
    if (
      isSubmitted &&
      signUpState.firstName &&
      signUpState.email &&
      signUpState.password &&
      signUpState.favoriteColor &&
      signUpState.agreeTermsAndConditions
    ) {
      navigate("/confirmation");
    }
  }, [signUpState]);

  const onSubmit: SubmitHandler<SignUpAdditionalInfoInputs> = (data) => {
    setSignUpState({
      ...signUpState,
      favoriteColor: data.favoriteColor,
      agreeTermsAndConditions: data.agreeTermsAndConditions,
    });
  };

  return (
    <Box>
      <VStack spacing={6}>
        <Heading as="h1">Additional Information</Heading>
        <Text>Just a few more things.</Text>
        <Box
          as="form"
          data-testid="more-info-form"
          width="100%"
          onSubmit={handleSubmit(onSubmit)}
        >
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.favoriteColor}>
              <FormLabel>Choose your favorite color</FormLabel>
              <Select
                data-testid="color-select"
                placeholder="Choose a color"
                {...register("favoriteColor", { required: true })}
              >
                {colors.map((color) => (
                  <option
                    value={color}
                    key={color}
                    data-testid="color-select-option"
                  >
                    {color}
                  </option>
                ))}
              </Select>
              {errors.favoriteColor &&
                errors.favoriteColor.type === "required" && (
                  <FormErrorMessage>
                    Favorite color is required.
                  </FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={!!errors.agreeTermsAndConditions}>
              <HStack>
                <Checkbox
                  data-testid="terms-checkbox"
                  {...register("agreeTermsAndConditions", { required: true })}
                >
                  I Agree to{" "}
                  <Link
                    fontWeight={600}
                    href="https://google.com"
                    color="blue.500"
                    isExternal
                  >
                    Terms and Conditions
                  </Link>
                </Checkbox>
              </HStack>
              <FormErrorMessage>
                You must agree to the terms and conditions.
              </FormErrorMessage>
            </FormControl>
            <HStack justifyContent="space-between" width="100%">
              <Button
                type="button"
                variant="outline"
                colorScheme="green"
                onClick={(event) => navigate("/")}
              >
                Back
              </Button>
              <Button type="submit" variant="solid" colorScheme="green">
                Next
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default SignUpAdditionalInfo;
