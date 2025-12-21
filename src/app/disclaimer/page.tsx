import Wrapper from "@/components/Wrapper";
import { DISCLAIMER } from "@/constants/pages";
import { Container, Typography, Box } from "@mui/material";
import { defaultMetadata, getPageSpecificMetadata } from "@/utils/get-metadata";
import { initEventTracking } from "@/utils/analytics";

export default function Disclaimer() {
  initEventTracking({
    selected_year: new Date().getFullYear().toString(),
  });

  return (
    <Wrapper title={DISCLAIMER.name}>
      <Container maxWidth="md">
        <Typography variant="h2" textAlign="center" sx={{ mb: 4 }}>
          Disclaimer
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Not Professional Tax Advice
          </Typography>
          <Typography variant="body1" paragraph>
            The information provided by this income tax calculator is for
            general informational and educational purposes only. All tax
            calculations, rates, brackets, and other data presented on this
            website are based on information gathered through internet research
            and have not been independently verified by certified tax
            professionals or government agencies.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            No Guarantee of Accuracy
          </Typography>
          <Typography variant="body1" paragraph>
            While we strive to provide accurate and up-to-date information, we
            make no representations or warranties of any kind, express or
            implied, about the completeness, accuracy, reliability, or
            suitability of the tax calculations or information provided. Tax
            laws are complex and frequently change, and individual circumstances
            vary significantly.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Not for Legal or Financial Decisions
          </Typography>
          <Typography variant="body1" paragraph>
            This calculator and the information it provides should NOT be used
            for:
          </Typography>
          <Box component="ul" sx={{ ml: 3 }}>
            <Typography component="li" variant="body1" paragraph>
              Filing actual tax returns
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Making financial decisions
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Legal or tax planning purposes
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Determining actual tax liability
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Consult a Professional
          </Typography>
          <Typography variant="body1" paragraph>
            For accurate tax calculations and advice specific to your situation,
            please consult a qualified tax professional, certified public
            accountant (CPA), or tax attorney. You should also refer to official
            IRS publications and your state&apos;s department of revenue for
            authoritative information.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            Under no circumstances shall we be liable for any direct, indirect,
            incidental, special, or consequential damages that result from the
            use of, or the inability to use, the information provided by this
            calculator, even if we have been advised of the possibility of such
            damages.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            User Responsibility
          </Typography>
          <Typography variant="body1" paragraph>
            By using this calculator, you acknowledge that you understand and
            accept this disclaimer. You agree to use this tool at your own risk
            and to verify any information with official sources before making
            any decisions based on the calculations provided.
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 4,
            p: 2,
            bgcolor: "background.paper",
            borderLeft: 4,
            borderColor: "primary.main",
          }}
        >
          <Typography variant="body2" fontStyle="italic">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Container>
    </Wrapper>
  );
}

export async function generateMetadata() {
  return {
    title: "Disclaimer - Income Tax Calculator",
    description:
      "Important disclaimer about the use of this income tax calculator. This tool provides estimates for informational purposes only and should not be used for legal or tax filing purposes.",
    ...defaultMetadata,
    ...getPageSpecificMetadata(DISCLAIMER.name),
  };
}
