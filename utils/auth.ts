import { AlertState } from 'components/Alert';
import SpotifyConnection, { UserProfile } from './spotify';

const errorMessages = {
    access_denied: 'Access to Spotify was denied.',
    invalid_token: 'Authorization with Spotify failed.',
} as Record<string, string>;

export function handleAuthError(errorCode: unknown, handleAlertChange: (state: AlertState) => void): void {
    handleAlertChange({
        severity: 'error',
        message:
            typeof errorCode === 'string' && errorCode in errorMessages
                ? errorMessages[errorCode]
                : `An error occured. (Code: ${errorCode})`,
    });
}

export interface VerifyAuthTokensOptions {
    accessToken: string;
    refreshToken: string;
    onNewAlert: (state: AlertState) => void;
    onConnectionVerification: (connection: SpotifyConnection | null) => void;
    onGettingUserProfile: (profile: UserProfile) => void;
    onAccessTokenChange: (newToken: string) => void;
}

export async function verifyAuthTokens(options: VerifyAuthTokensOptions): Promise<void> {
    const {
        accessToken,
        refreshToken,
        onNewAlert,
        onGettingUserProfile,
        onAccessTokenChange,
        onConnectionVerification,
    } = options;

    const handleGettingUserProfile = (userProfile: UserProfile) => {
        onGettingUserProfile(userProfile);
        onNewAlert({
            severity: 'success',
            message: `Successfully connected to ${userProfile.display_name}'s Spotify profile.`,
        });
    };

    try {
        const connection = await SpotifyConnection.establish({
            accessToken,
            refreshToken,
            onGettingUserProfile: handleGettingUserProfile,
            onAccessTokenChange,
        });

        onConnectionVerification(connection);
    } catch (errorCode) {
        onConnectionVerification(null);
        if (errorCode === 400) {
            handleAuthError('invalid_token', onNewAlert);
        } else {
            handleAuthError(typeof errorCode === 'number' ? `HTTP response ${errorCode}` : errorCode, onNewAlert);
        }
    }
}
