import { useState } from 'react';
import Container from '@mui/material/Container';
import type { FC } from 'react';
import {
  Box,
  Button,
  Typography,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Grid,
  List,
  ListItem,
} from '@mui/material';
import { useFormik } from 'formik';
import AlertBox from './components/AlertBox';
import SOCIAL_MEDIA_TYPES from './constants';
import getIcon from './utils/getIcon';

interface SocialMediaListType {
  id: string;
  link: string;
  type: string;
}

const App: FC = () => {
  const [collapseOpen, setCollapseOpen] = useState<boolean>(false);
  const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);
  const [socialMediaList, setSocialMediaList] = useState<SocialMediaListType[]>([{ id: 'test', link: 'https://google.com', type: 'instagram' }]);
  const [currentSocialMedia, setCurrentSocialMedia] = useState<SocialMediaListType | null>(null);

  const onCollapseOpen = (): void => {
    setCollapseOpen(true);
  };

  const onCollapseClose = (): void => {
    setCollapseOpen(false);
  };

  const toggleOpenForm = (): void => {
    setCollapseOpen((prevOpenForm) => !prevOpenForm);
  };

  const closeAlertBox = (): void => {
    setOpenAlertBox(false);
  };

  const add = (values: SocialMediaListType): void => {
    const found = socialMediaList.some(
      (item) => item.id === values.id || item.link === values.link || item.type === values.type,
    );
    // TODO: handle validation with formik
    const isOneValueEmpty = values.id === '' || values.link === '' || values.type === '';

    if (!found && !isOneValueEmpty) {
      setSocialMediaList(
        [...socialMediaList, { id: values.id, link: values.link, type: values.type }],
      );
    }
  };

  const setEdit = (values: SocialMediaListType): void => {
    const newSocialMediaList = [...socialMediaList];
    const foundIndex = socialMediaList.findIndex((item) => item.id === currentSocialMedia.id);

    newSocialMediaList[foundIndex] = {
      id: values.id,
      link: values.link,
      type: values.type,
    };

    setSocialMediaList(newSocialMediaList);
    setCurrentSocialMedia(null);
  };

  const setDelete = (): void => {
    const updatedList = socialMediaList.filter((item) => item.id !== currentSocialMedia.id);
    setSocialMediaList(updatedList);
    closeAlertBox();
  };

  const formik = useFormik({
    initialValues: { type: '', link: '', id: '' },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        if (currentSocialMedia) {
          setEdit(values);
        } else {
          add(values);
        }
        setSubmitting(false);
        resetForm();
      }, 400);
    },
  });
  const onDelete = (SocialMediaItem: SocialMediaListType): void => {
    setCurrentSocialMedia(SocialMediaItem);
    setOpenAlertBox(true);
  };

  const onEdit = (item: SocialMediaListType): void => {
    onCollapseOpen();
    formik.setValues(item as SocialMediaListType);
    setCurrentSocialMedia(item);
  };

  const onCancel = (): void => {
    formik.resetForm();
    onCollapseClose();
    setCurrentSocialMedia(null);
  };

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleSubmit,
    handleChange,
  } = formik;

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          backgroundColor: '#2D4356',
          borderRadius: '16px',
          p: '20 ',
        }}
      >
        <AlertBox
          confirm={setDelete}
          dismiss={closeAlertBox}
          open={openAlertBox}
          title="آیا از تصمیم خود مطمئن هستید؟"
        >
          {/* {`لطفا تایید را بنویسید ${currentItem.id} برای حذف مسیر ارتباطی`} */}
        </AlertBox>
        <Typography>
          مسیر های ارتباطی
        </Typography>
        <Button endIcon={getIcon(!currentSocialMedia ? 'add' : 'edit')} variant="text" onClick={toggleOpenForm}>
          {currentSocialMedia
            ? (
              <Typography>
                ویرایش مسیر ارتباطی
              </Typography>
            )
            : (
              <Typography>
                افزودن مسیر ارتباطی
              </Typography>
            )}
        </Button>
        <Collapse in={collapseOpen}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader title={currentSocialMedia ? `ویرایش مسیر ارتباطی ${SOCIAL_MEDIA_TYPES[values.type]}` : 'افزودن مسیر ارتباطی'} />
              <CardContent>
                <Grid container justifyContent="space-evenly" spacing={2}>
                  <Grid item xs={4}>
                    <FormControl fullWidth sx={{ minWidth: 120 }}>
                      <InputLabel id="type-value-select-label">
                        نوع*
                      </InputLabel>
                      <Select
                        label="نوع*"
                        labelId="type-value-select-label"
                        name="type"
                        renderValue={(value) => (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {getIcon(values.type)}
                            {value}
                          </div>
                        )}
                        value={values.type}
                        onChange={handleChange}
                      >
                        <MenuItem value="instagram">
                          <Typography>
                            {SOCIAL_MEDIA_TYPES.instagram}
                          </Typography>
                        </MenuItem>
                        <MenuItem value="facebook">
                          <Typography>
                            {SOCIAL_MEDIA_TYPES.facebook}
                          </Typography>
                        </MenuItem>
                        <MenuItem value="telegram">
                          <Typography>
                            {SOCIAL_MEDIA_TYPES.telegram}
                          </Typography>
                        </MenuItem>
                        <MenuItem value="twitter">
                          <Typography>
                            {SOCIAL_MEDIA_TYPES.twitter}
                          </Typography>
                        </MenuItem>
                        <MenuItem value="linkedin">
                          <Typography>
                            {SOCIAL_MEDIA_TYPES.linkedin}
                          </Typography>
                        </MenuItem>
                        <MenuItem value="website">
                          <Typography>
                            {SOCIAL_MEDIA_TYPES.website}
                          </Typography>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.link && errors.link)}
                      label="لینک"
                      name="link"
                      value={values.link}
                      onChange={handleChange}
                    />
                    {touched.link && errors.link && <div>{errors.link}</div>}
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.id && errors.id)}
                      label="(ID) آی دی"
                      name="id"
                      value={values.id}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel}>انصراف</Button>
                <Button disabled={isSubmitting} type="submit" variant="contained">
                  {currentSocialMedia
                    ? (
                      <Typography>
                        {`ویرایش مسیر ارتباطی ${SOCIAL_MEDIA_TYPES[values.type]}`}
                      </Typography>
                    )
                    : (
                      <Typography>
                        افزودن مسیر ارتباطی
                      </Typography>
                    )}
                </Button>
              </CardActions>
            </Card>
          </form>
        </Collapse>
        <List>
          {
          socialMediaList.length ? socialMediaList.map((item) => (
            <ListItem key={item.id}>
              <Grid container alignItems="center">
                <Grid item>
                  {getIcon(item.type)}
                  {SOCIAL_MEDIA_TYPES[item.type]}
                </Grid>
                <Grid item>
                  {item.id}
                </Grid>
                <Grid item>
                  {item.link}
                </Grid>
                <Grid item>
                  <Button startIcon={getIcon('edit')} variant="text" onClick={() => onEdit(item)}>
                    ویرایش
                  </Button>
                </Grid>
                <Grid item>
                  <Button color="error" startIcon={getIcon('delete')} variant="text" onClick={() => onDelete(item)}>
                    حذف
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          )) : ''
        }
        </List>
      </Box>
    </Container>
  );
};

export default App;
