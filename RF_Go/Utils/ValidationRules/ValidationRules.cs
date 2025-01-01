namespace RF_Go.Utils.ValidationRules
{
    public class ValidationRules
    {
        public bool UppercaseOnly { get; set; }
        public bool NoSpecialCharacters { get; set; }
        public int MaxLength { get; set; }
    }

    public static class DeviceValidationRules
    {
        public static readonly Dictionary<string, ValidationRules> Rules = new Dictionary<string, ValidationRules>
            {
                { "EWDX2CH", new ValidationRules { UppercaseOnly = true, NoSpecialCharacters = true, MaxLength = 8 } },
            };
    }

    public static class ValidationHelper
    {
        public static (string ValidatedInput, List<string> Errors) ValidateInput(string model, string input)
        {
            var errors = new List<string>();
            var validatedInput = input;

            if (DeviceValidationRules.Rules.TryGetValue(model, out var rules))
            {
                if (rules.UppercaseOnly && input.Any(char.IsLower))
                {
                    errors.Add("Text must be uppercase.");
                    validatedInput = validatedInput.ToUpper();
                }
                if (rules.NoSpecialCharacters && input.Any(c => !char.IsLetterOrDigit(c)))
                {
                    errors.Add("Special characters are not allowed.");
                    validatedInput = new string(validatedInput.Where(c => char.IsLetterOrDigit(c)).ToArray());
                }
                if (input.Length > rules.MaxLength)
                {
                    errors.Add($"Maximum length is {rules.MaxLength} characters.");
                    validatedInput = validatedInput.Substring(0, rules.MaxLength);
                }
            }

            return (validatedInput, errors);
        }
    }
}

