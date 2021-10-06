import React from "react";
import applicationService from "../../../services/Application";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {Button, Card, CardMedia, CircularProgress, Grid, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import {PhotoCamera as PhotoCameraIcon} from "@material-ui/icons";
import {APPLICATIONS_IMAGE_BASE_URL} from "../../../config";

const useStyles = makeStyles((theme) => ({
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '14px',
        marginTop: '-14px',
    }
}));

const UploadImage: React.FC<{images: string, canAddPhoto: boolean, applicationId: number, onAddImage: Function}> = ({images, canAddPhoto, applicationId, onAddImage}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = React.useState(false)

    const handleSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()

        const target = event.target as HTMLInputElement;
        const file = (target.files!)[0];

        if (file === undefined) return;

        try {
            setLoading(true)

            const fetchImages: any = await applicationService.uploadPhoto(applicationId, file)

            onAddImage(fetchImages)
            enqueueSnackbar('Изображения добавлен', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Grid
                container
                justifyContent="space-between"
                spacing={4}
            >
                <Grid item>
                    <Typography
                        variant="h4"
                        color="textPrimary"
                    >
                        Фотографии:
                    </Typography>
                </Grid>
                {canAddPhoto && (
                    <Grid item>
                        <input
                            accept="image/*"
                            type="file"
                            id="icon-button-file"
                            hidden
                            onChange={handleSelectFile}
                        />
                        <label htmlFor="icon-button-file" style={{position: 'relative'}}>
                            <Button
                                color="secondary"
                                variant="outlined"
                                component="span"
                                className={classes.action}
                                disabled={loading}
                            >
                                <SvgIcon
                                    fontSize="small"
                                    className={classes.actionIcon}
                                >
                                    {!loading && <PhotoCameraIcon />}
                                </SvgIcon>
                                Добавить
                            </Button>
                            {loading && <CircularProgress size={20} className={classes.loadingProgress} />}
                        </label>
                    </Grid>
                )}
            </Grid>
            <Grid
                container
                justifyContent="space-between"
                spacing={4}
            >
                {images?.split(',').map((img, index) => (
                    <Grid item md={4} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={APPLICATIONS_IMAGE_BASE_URL + img}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default UploadImage
